"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { springMove, stagger } from "../../lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Position in a group — turns a set of entrances into a cascade. */
  index?: number;
  className?: string;
};

/**
 * Entrance cascade, played on mount.
 *
 * Deliberately not scroll-triggered: an `initial` of opacity 0 is rendered into
 * the server HTML, so keying the reveal to an IntersectionObserver leaves the
 * whole page blank until that observer fires — and blank for good if scripts
 * never run. Under reduced motion the travel is dropped and only the cross-fade
 * remains.
 */
export default function Reveal({ children, index = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springMove, delay: stagger(index) }}
    >
      {children}
    </motion.div>
  );
}
