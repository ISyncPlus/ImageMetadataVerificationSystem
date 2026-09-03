"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

type RadarPingProps = {
  className?: string;
  size?: number;
};

/**
 * Geodetic Radar Pulse & Campus GPS Beacon Ping
 * 
 * Generates continuous concentric geodetic range rings around the coordinate anchor.
 */
export default function RadarPing({ className = "", size = 18 }: RadarPingProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span
        className={`inline-block rounded-full bg-[var(--brand)] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Expanding Concentric Range Rings */}
      <motion.span
        className="absolute inset-0 rounded-full border border-[var(--brand)] opacity-75"
        animate={{ scale: [1, 2.6], opacity: [0.8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 1.6 }}
      />
      <motion.span
        className="absolute inset-0 rounded-full border border-[var(--brand)] opacity-50"
        animate={{ scale: [1, 3.8], opacity: [0.6, 0] }}
        transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: "easeOut", repeatDelay: 1.6 }}
      />
      {/* Central Solid Datum Beacon */}
      <span
        className="relative z-10 rounded-full bg-[var(--brand)] shadow-sm"
        style={{ width: size * 0.55, height: size * 0.55 }}
      />
    </span>
  );
}
