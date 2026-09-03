"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

type ForensicScanProps = {
  active?: boolean;
  color?: "brand" | "green" | "amber";
  className?: string;
  showReticle?: boolean;
};

/**
 * Optical Laser Scanning Reticle & Telemetry Surface Sweep
 * 
 * Provides an authentic forensic beam sweep with optical reticle crosshairs
 * and coordinate datum markers.
 */
export default function ForensicScan({
  active = true,
  color = "brand",
  className = "",
  showReticle = true,
}: ForensicScanProps) {
  const reduced = useReducedMotion();

  if (reduced || !active) return null;

  /* Every value resolves through a design token rather than a fixed palette
     step, so the beam re-reads its colour from the theme — and from the field
     it is dropped into. The glow is mixed from the same token as the line, so
     the two can never drift apart. */
  const wash = (token: string) =>
    `color-mix(in oklab, var(${token}) 35%, transparent)`;

  const colorStyles = {
    brand: {
      line: "bg-accent",
      glow: wash("--brand"),
      crosshair: "text-accent",
    },
    green: {
      line: "bg-good-mark",
      glow: wash("--good-mark"),
      crosshair: "text-good",
    },
    amber: {
      line: "bg-warn-mark",
      glow: wash("--warn-mark"),
      crosshair: "text-warn",
    },
  }[color];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Sweeping Laser Beam */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] z-20"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{
          duration: 3.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          // A pause at each end so the beam reads as an occasional pass over
          // the frame rather than a metronome — motion that never rests is
          // the single biggest source of "too much going on" on this page.
          repeatDelay: 1.4,
        }}
      >
        <div className={`h-full w-full ${colorStyles.line}`} />
        <div
          className="absolute -top-6 left-0 right-0 h-12"
          style={{
            background: `linear-gradient(to bottom, transparent, ${colorStyles.glow}, transparent)`,
          }}
        />
        {/* Optical Scanning Head / Reticle Node */}
        {showReticle && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full border border-current bg-surface shadow-sm ${colorStyles.crosshair}`}
            />
            <span
              className="t-mark rounded-sm border border-line bg-surface/90 px-1.5 py-0.5 text-[0.5625rem] text-ink backdrop-blur-md"
            >
              SCANNING EXIF
            </span>
          </div>
        )}
      </motion.div>

      {/* Grid Calibrators on Corners */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-ink-3/40" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-ink-3/40" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-ink-3/40" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-ink-3/40" />
    </div>
  );
}
