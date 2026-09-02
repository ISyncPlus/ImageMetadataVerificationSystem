"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp } from "./icons";
import { springMove, springSnappy } from "../../lib/motion";

/**
 * Lenis exponential ease-out: starts fast and decelerates into a silky soft
 * landing. Identical to the easing used on devrajchatribin.com.
 */
const lenisEaseOut = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * ScrollControls
 *
 * Provides immediate-response scroll-to-top and scroll-to-bottom actions
 * with Lenis-style exponential deceleration for a soft landing.
 */
export default function ScrollControls() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      setVisible(y > 160);
      setAtBottom(y + winHeight >= docHeight - 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (targetY: number) => {
    if (reduced) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      return;
    }

    // Cancel any in-flight scroll animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 1200; // ms, matching Lenis default
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = lenisEaseOut(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const scrollToTop = () => smoothScrollTo(0);
  const scrollToBottom = () =>
    smoothScrollTo(document.documentElement.scrollHeight);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.92 }}
          transition={springMove}
          aria-label="Page scroll navigation"
          className="fixed bottom-6 right-6 z-40 hidden flex-col items-center gap-1 rounded-full border border-material-edge bg-material p-1.5 shadow-lift backdrop-blur-xl sm:flex"
        >
          {/* Scroll to Top */}
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            title="Scroll to top"
            whileHover={reduced ? {} : { scale: 1.08 }}
            whileTap={reduced ? { opacity: 0.7 } : { scale: 0.9 }}
            transition={springSnappy}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-well text-ink-2 transition-colors hover:bg-accent hover:text-accent-ink"
          >
            <ChevronUp size={16} strokeWidth={2.4} />
          </motion.button>

          {/* Scroll to Bottom (only if not already at bottom) */}
          {!atBottom && (
            <motion.button
              type="button"
              onClick={scrollToBottom}
              aria-label="Scroll to bottom of page"
              title="Scroll to bottom"
              initial={false}
              whileHover={reduced ? {} : { scale: 1.08 }}
              whileTap={reduced ? { opacity: 0.7 } : { scale: 0.9 }}
              transition={springSnappy}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-well text-ink-2 transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <ChevronDown size={16} strokeWidth={2.4} />
            </motion.button>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
