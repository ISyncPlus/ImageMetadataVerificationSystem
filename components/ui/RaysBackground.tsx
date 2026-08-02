"use client";

import { useReducedMotion } from "motion/react";
import SideRays from "../SideRays";
import { useTheme } from "../../lib/useTheme";

/** Tuned per theme: light needs the rays to stay well under the text, dark can
 *  carry more of them. Hues follow the brand accent rather than the demo's. */
const PALETTE = {
  light: {
    rayColor1: "#7fb0ff",
    rayColor2: "#c3b2ff",
    intensity: 0.8,
    saturation: 1,
    opacity: 0.32,
  },
  dark: {
    rayColor1: "#2997ff",
    rayColor2: "#7d5cff",
    intensity: 1.45,
    saturation: 1.25,
    opacity: 0.5,
  },
} as const;

export default function RaysBackground() {
  const reduced = useReducedMotion();
  const { resolved } = useTheme();

  /* A full-viewport moving background is exactly what reduced motion is for —
     the static wash underneath carries the same colour on its own. */
  if (reduced) return null;

  return (
    <SideRays
      origin="top-right"
      speed={1}
      spread={1.8}
      tilt={-4}
      blend={0.7}
      falloff={1.8}
      {...PALETTE[resolved]}
    />
  );
}
