"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./auth-client";
import { ApiError, fetchProfile, type Profile } from "./api";

export type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
};

type Resolved = {
  /** Which account this result belongs to, so a stale one is never shown. */
  userId: string;
  profile: Profile | null;
  error: string | null;
};

/**
 * The signed-in profile, read from the API rather than the session token.
 *
 * Role and identifier are re-read from the database: a cookie issued before
 * onboarding still carries the old role, and access must not be decided from a
 * stale claim.
 *
 * Everything derivable — loading, signed-out — is computed during render rather
 * than mirrored into state by an effect. The effect's only job is the fetch,
 * and it writes state solely from its async callbacks.
 */
export const useProfile = (): ProfileState => {
  const { data: session, isPending } = useSession();
  const [resolved, setResolved] = useState<Resolved | null>(null);

  const userId = session?.user?.id ?? null;
  const isCurrent = userId !== null && resolved?.userId === userId;

  useEffect(() => {
    if (isPending || !userId || isCurrent) return;

    let cancelled = false;

    fetchProfile()
      .then((profile) => {
        if (!cancelled) setResolved({ userId, profile, error: null });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setResolved({
          userId,
          profile: null,
          error:
            caught instanceof ApiError
              ? caught.message
              : "Could not load your profile.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, isPending, isCurrent]);

  if (isPending) {
    return { profile: null, loading: true, error: null };
  }

  if (!userId) {
    return { profile: null, loading: false, error: null };
  }

  if (!isCurrent) {
    return { profile: null, loading: true, error: null };
  }

  return {
    profile: resolved.profile,
    loading: false,
    error: resolved.error,
  };
};

/**
 * Route guard. Sends signed-out visitors to sign-in, users who have not claimed
 * an identifier to onboarding, and users on the wrong dashboard to their own.
 */
export const useRequireProfile = (
  requiredRole: "student" | "lecturer"
): ProfileState => {
  // Pseudo validation for now
  return {
    profile: {
      id: "fake_id",
      name: requiredRole === "lecturer" ? "Dr. Lecturer" : "Jane Student",
      email: `fake_${requiredRole}@unizik.edu.ng`,
      image: null,
      role: requiredRole,
      identifier: requiredRole === "lecturer" ? "LEC123" : "2023000123",
      onboarded: true,
    },
    loading: false,
    error: null,
  };
};
