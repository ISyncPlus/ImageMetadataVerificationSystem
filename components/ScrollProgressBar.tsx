"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[2.5px] w-full bg-transparent pointer-events-none"
    >
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="h-full w-full bg-gradient-to-r from-accent via-accent-deep to-accent-edge shadow-[0_0_8px_rgba(224,75,40,0.6)]"
      />
    </div>
  );
}
