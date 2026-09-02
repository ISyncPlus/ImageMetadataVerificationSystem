"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { springMove, stagger } from "../../lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Position in a group — turns a set of entrances into a cascade. */
  index?: number;
  /**
   * `mount` plays on hydration; correct above the fold, where an
   * IntersectionObserver would fire in the same frame anyway.
   * `scroll` waits for the element to approach the viewport — correct for
   * everything below it, so the page reveals as it is read rather than
   * animating a screenful the reader will never see.
   */
  mode?: "mount" | "scroll";
  /** Travel distance. Heavier sections want a longer, slower arrival. */
  distance?: number;
  className?: string;
};

/**
 * Entrance cascade.
 *
 * The travel is paired with a small blur that resolves as the element settles:
 * a focus pull, which reads as the element *arriving* rather than sliding. It
 * is animated on `filter`, so it stays off the layout path.
 *
 * Under reduced motion the travel and the blur are both dropped and only the
 * cross-fade remains — the feedback survives, the vestibular part does not.
 */
export default function Reveal({
  children,
  index = 0,
  mode = "mount",
  distance = 18,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();

  const hidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: distance, filter: "blur(6px)" };
  const shown = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  const transition = {
    ...springMove,
    duration: reduced ? 0.2 : 0.7,
    delay: stagger(index),
  };

  if (mode === "scroll") {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={shown}
        viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={shown}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
