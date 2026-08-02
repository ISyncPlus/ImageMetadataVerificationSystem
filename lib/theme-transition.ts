/**
 * Theme transition — the CSS that drives a View Transition when the appearance
 * changes.
 *
 * `createAnimation(start, blur)` returns a stylesheet targeting the
 * `::view-transition-old/new(root)` pseudo-elements. The caller injects it into
 * the document and then calls `document.startViewTransition`. Which set of
 * keyframes runs is selected by the `dark` class on <html>, which `applyTheme`
 * sets alongside `data-theme`.
 *
 * The new theme sweeps in as a diagonal band from one top corner towards the
 * opposite one, briefly blurred so it reads as a wipe rather than a hard edge.
 *
 * Adapted for IMVS from the Skiper UI "Skiper26" component. The interactive
 * demo, its options panel and the next-themes-based hook were dropped — this
 * app has its own theme store in lib/useTheme.ts — as were the variants it
 * ships that this app does not use (circle, rectangle, gif, circle-blur); all
 * remain in git history. Original attribution and licence terms are preserved
 * at the foot of this file.
 */

export type AnimationStart = "top-left" | "top-right";

export type Animation = {
  name: string;
  css: string;
};

/** The band's start and end shapes, per corner. The percentages overshoot the
 *  box so it fully clears the viewport at both ends of the sweep. */
const CLIP_PATHS: Record<
  AnimationStart,
  { darkFrom: string; darkTo: string; lightFrom: string; lightTo: string }
> = {
  "top-left": {
    darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
    darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
    lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
    lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
  },
  "top-right": {
    darkFrom: "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)",
    darkTo: "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)",
    lightFrom: "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)",
    lightTo: "polygon(-71% 50%, 50% 171%, 250% 71%, 150% -71%)",
  },
};

const keyframes = (name: string, from: string, to: string, blur: boolean) => `
      @keyframes ${name} {
        from {
          clip-path: ${from};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${to};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }`;

export const createAnimation = (
  start: AnimationStart = "top-left",
  blur = true
): Animation => {
  const clip = CLIP_PATHS[start];
  const suffix = `${start}${blur ? "-blur" : ""}`;

  /* Only the incoming snapshot animates; the outgoing one is parked behind it,
     so the band reveals the new theme over the old rather than cross-fading. */
  return {
    name: `polygon-${suffix}`,
    css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }

      ::view-transition-new(root) {
        animation-name: reveal-light-${suffix};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${suffix};
        ${blur ? "filter: blur(2px);" : ""}
      }
      ${keyframes(`reveal-dark-${suffix}`, clip.darkFrom, clip.darkTo, blur)}
      ${keyframes(`reveal-light-${suffix}`, clip.lightFrom, clip.lightTo, blur)}
    `,
  };
};

/**
 * Skiper 26 Theme_buttons_002 — React + CSS + transition view api  https://developer.chrome.com/docs/web-platform/view-transitions/
 * Orignal concept from rudrodip
 * Inspired by from https://github.com/rudrodip/theme-toggle-effect
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the rudrodip . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
