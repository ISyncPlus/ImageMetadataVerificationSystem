"use client";

import { motion, useReducedMotion } from "motion/react";
import { springMove } from "../../lib/motion";
import type { VerificationStatus } from "../../lib/types";

type StatusMeterProps = {
  counts: Record<VerificationStatus, number>;
  total: number;
};

const SEGMENTS: Array<{ status: VerificationStatus; fill: string }> = [
  { status: "Verified", fill: "bg-good-mark" },
  { status: "Suspicious", fill: "bg-warn-mark" },
  { status: "Reused", fill: "bg-bad-mark" },
];

/**
 * The share of each status across all submissions. Segments are separated by a
 * surface-coloured gap so adjacent fills never touch, and every segment is
 * named in the tiles above — colour is never the only thing carrying identity.
 */
export default function StatusMeter({ counts, total }: StatusMeterProps) {
  const reduced = useReducedMotion();
  if (total === 0) return null;

  return (
    <div className="flex h-2 w-full gap-0.5" role="img"
      aria-label={SEGMENTS.map(
        ({ status }) =>
          `${status}: ${counts[status]} of ${total}`
      ).join(", ")}
    >
      {SEGMENTS.map(({ status, fill }) => {
        const share = (counts[status] / total) * 100;
        if (share === 0) return null;
        return (
          <motion.span
            key={status}
            title={`${status}: ${counts[status]} of ${total}`}
            className={`h-full rounded-full ${fill}`}
            initial={false}
            animate={{ width: `${share}%` }}
            transition={reduced ? { duration: 0 } : springMove}
          />
        );
      })}
    </div>
  );
}
