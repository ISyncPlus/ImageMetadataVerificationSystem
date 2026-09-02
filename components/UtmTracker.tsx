"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
] as const;

const UTM_STORAGE_KEY = "provenance_utm_attribution_v1";

/**
 * Captures UTM marketing attribution parameters on initial touchpoint
 * and stores them in sessionStorage so academic campaign analytics can be tracked.
 */
export function UtmTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const captured: Record<string, string> = {};
    let hasUtm = false;

    UTM_PARAMS.forEach((param) => {
      const val = searchParams.get(param);
      if (val) {
        captured[param] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      const payload = {
        ...captured,
        timestamp: new Date().toISOString(),
        referrer: typeof document !== "undefined" ? document.referrer : "",
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(payload));
    }
  }, [searchParams]);

  return null;
}
