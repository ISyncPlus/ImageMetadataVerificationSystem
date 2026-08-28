"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Better Auth client. `inferAdditionalFields` teaches it about the columns this
 * app added to User, so `session.user.role` is typed rather than `any`.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    /*
     * `input: false` mirrors the server. Without it the inferred `signUp.email`
     * signature demands a `role`, which is precisely the thing a client must
     * never be able to state (ARCHITECTURE.md, Decision 3).
     */
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, input: false },
        identifier: { type: "string", required: false, input: false },
        onboardedAt: { type: "date", required: false, input: false },
      },
    }),
  ],
  fetchOptions: {
    // The session cookie is set by a different origin in development; without
    // this the browser will not attach it and every call reads as signed-out.
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;

export type UserRole = "student" | "lecturer";

export const dashboardPathFor = (role: UserRole): string =>
  role === "lecturer" ? "/lecturer" : "/student";

/** Which OAuth buttons to render — mirrors what the API has configured. */
export const enabledProviders = {
  google: process.env.NEXT_PUBLIC_ENABLE_GOOGLE !== "false",
  github: process.env.NEXT_PUBLIC_ENABLE_GITHUB !== "false",
};
