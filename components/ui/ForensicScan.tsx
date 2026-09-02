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

  const colorStyles = {
    brand: {
      line: "bg-[var(--brand)]",
      glow: "rgba(224, 75, 40, 0.35)",
      crosshair: "text-[var(--brand)]",
    },
    green: {
      line: "bg-emerald-500",
      glow: "rgba(16, 185, 129, 0.35)",
      crosshair: "text-emerald-500",
    },
    amber: {
      line: "bg-amber-500",
      glow: "rgba(245, 158, 11, 0.35)",
      crosshair: "text-amber-500",
    },
  }[color];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Sweeping Laser Beam */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] z-20"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{
          duration: 3.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
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
              className={`h-2.5 w-2.5 rounded-full border border-current bg-background ${colorStyles.crosshair} shadow-sm animate-pulse`}
            />
            <span
              className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-background/90 border border-line text-ink backdrop-blur-md"
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
