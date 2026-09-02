"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { createAnimation } from "./theme-transition";
import { applyTheme, resolveTheme, THEME_KEY } from "./theme";
import type { ThemePreference } from "./theme";

const THEME_EVENT = "imvs:theme";
const STYLE_ID = "theme-transition-styles";

/** The preference lives in localStorage, so it is read as an external store —
 *  same shape as the session and history stores. */
const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
};

const getSnapshot = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* Private mode — fall through to the default. */
  }
  return "system";
};

const getServerSnapshot = (): ThemePreference => "system";

/* The resolved appearance is read back off the document, because the bootstrap
   script already computed it before first paint. Deriving it from matchMedia
   instead would make the first client render guess "light" and then correct
   itself — a visible flicker on every dark-mode load. */
const getResolvedSnapshot = (): "light" | "dark" =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const getServerResolved = (): "light" | "dark" => "light";

/** Swaps in the keyframes for this particular transition before it runs. */
const installTransitionStyles = (css: string) => {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
};

export const useTheme = () => {
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const resolved = useSyncExternalStore(
    subscribe,
    getResolvedSnapshot,
    getServerResolved
  );

  /* Following the system means following it as it changes, not just at load.
     The DOM is updated first, then the store is told to re-read it. */
  useEffect(() => {
    if (preference !== "system") return;
    const list = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      applyTheme("system");
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    const commit = () => {
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* Private mode — the theme still applies for this session. */
      }
      window.dispatchEvent(new Event(THEME_EVENT));
    };

    const changesAppearance =
      document.documentElement.dataset.theme !== resolveTheme(next);
    const wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* Only sweep when the pixels actually change — picking "System" while
       already on the system's theme should be a no-op, not a light show. */
    if (!changesAppearance || !wantsMotion || !document.startViewTransition) {
      commit();
      return;
    }

    installTransitionStyles(createAnimation("top-left").css);
    /* flushSync so React's own re-render lands inside the snapshot, rather
       than one frame after it. */
    const transition = document.startViewTransition(() => flushSync(commit));

    /* A view transition that gets skipped — a second toggle arriving before the
       first has settled, or the tab being hidden mid-sweep — rejects both of
       these with InvalidStateError. The callback above has already applied the
       theme by then, so there is nothing to recover: the only thing an
       unhandled rejection achieves is reporting a failure that did not happen. */
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  }, []);

  return { preference, resolved, setTheme };
};
