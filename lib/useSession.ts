"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardPathFor, loadSession } from "./auth";
import type { Session, UserRole } from "./auth";

/**
 * Client-side route guard for the prototype's simulated authentication.
 * Redirects to /login when no session exists, or to the user's own
 * dashboard when they open a page for the other role.
 */
export const useRequireSession = (requiredRole: UserRole): Session | null => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const current = loadSession();
    if (!current) {
      router.replace("/login");
      return;
    }
    if (current.role !== requiredRole) {
      router.replace(dashboardPathFor(current.role));
      return;
    }
    setSession(current);
  }, [router, requiredRole]);

  return session;
};
