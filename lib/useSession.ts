"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  dashboardPathFor,
  getServerSessionSnapshot,
  getSessionSnapshot,
  loadSession,
  subscribeToSession,
} from "./auth";
import type { Session, UserRole } from "./auth";

/** Reactive session state backed by localStorage (live across tabs). */
export const useSession = (): Session | null =>
  useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

/**
 * Client-side route guard for the prototype's simulated authentication.
 * Redirects to /login when no session exists, or to the user's own
 * dashboard when they open a page for the other role.
 */
export const useRequireSession = (requiredRole: UserRole): Session | null => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    // Read localStorage directly so a transiently-empty store snapshot
    // during hydration can never cause a spurious redirect.
    const current = loadSession();
    if (!current) {
      router.replace("/login");
      return;
    }
    if (current.role !== requiredRole) {
      router.replace(dashboardPathFor(current.role));
    }
  }, [router, requiredRole, session]);

  return session && session.role === requiredRole ? session : null;
};
