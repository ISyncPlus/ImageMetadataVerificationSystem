"use client";

import { useReducedMotion } from "motion/react";
import SideRays from "../SideRays";
import { useTheme } from "../../lib/useTheme";

/** Tuned per theme: light needs the rays to stay well under the text, dark can
 *  carry more of them. Hues follow the brand accent rather than the demo's. */
const PALETTE = {
  light: {
    rayColor1: "#e04b28",
    rayColor2: "#d97706",
    intensity: 0.55,
    saturation: 0.85,
    opacity: 0.18,
  },
  dark: {
    rayColor1: "#e04b28",
    rayColor2: "#b45309",
    intensity: 1.1,
    saturation: 1.05,
    opacity: 0.35,
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
