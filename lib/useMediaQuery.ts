"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a media query. Reports false on the server and for the first
 *  hydration render, then the real value. */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

/** Users who ask for less transparency get frosted-solid surfaces instead. */
export const useReducedTransparency = () =>
  useMediaQuery("(prefers-reduced-transparency: reduce)");
