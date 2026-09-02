"use client";

import type { LocationFix } from "./types";

/**
 * A single reading from the device's own positioning stack.
 *
 * The Geolocation API is asked for high accuracy and given a real timeout: the
 * default behaviour is to wait indefinitely, which on a phone that cannot get a
 * fix indoors means a submission flow that appears to hang. A refusal or a
 * timeout is a normal outcome here, not an error state — the caller records the
 * absence and carries on.
 */

export type GeolocationOutcome =
  | { ok: true; fix: LocationFix }
  | { ok: false; reason: GeolocationFailure; message: string };

export type GeolocationFailure =
  | "unsupported"
  | "denied"
  | "unavailable"
  | "timeout";

const MESSAGES: Record<GeolocationFailure, string> = {
  unsupported: "This browser cannot report a location.",
  denied:
    "Location permission was declined, so this submission carries no attested position.",
  unavailable:
    "The device could not obtain a position — this is common indoors and on desktops without GPS.",
  timeout: "The device did not return a position in time.",
};

const failure = (reason: GeolocationFailure): GeolocationOutcome => ({
  ok: false,
  reason,
  message: MESSAGES[reason],
});

export const readPosition = (
  options: { timeoutMs?: number; maximumAgeMs?: number } = {}
): Promise<GeolocationOutcome> => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(failure("unsupported"));
  }

  const { timeoutMs = 12_000, maximumAgeMs = 0 } = options;

  return new Promise<GeolocationOutcome>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({
          ok: true,
          fix: {
            latitude,
            longitude,
            accuracyMetres: Number.isFinite(accuracy) ? accuracy : null,
            fixedAt: new Date(position.timestamp).toISOString(),
          },
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) resolve(failure("denied"));
        else if (error.code === error.TIMEOUT) resolve(failure("timeout"));
        else resolve(failure("unavailable"));
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        /* A cached fix is worthless as evidence: it may predate the session. */
        maximumAge: maximumAgeMs,
      }
    );
  });
};

/**
 * Whether the browser will prompt. Used to warn a student *before* the capture
 * screen that their earlier refusal is still in force, rather than letting them
 * reach the shutter and find the position missing.
 */
export const permissionState = async (): Promise<
  "granted" | "denied" | "prompt" | "unknown"
> => {
  if (typeof navigator === "undefined" || !navigator.permissions) return "unknown";
  try {
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state;
  } catch {
    return "unknown";
  }
};
