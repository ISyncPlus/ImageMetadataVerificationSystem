"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp } from "./icons";
import { springMove, springSnappy } from "../../lib/motion";

/**
 * ScrollControls
 *
 * Provides soft, fluid scroll-to-top and scroll-to-bottom actions.
 * Appears seamlessly in the bottom right once the visitor begins scrolling.
 */
export default function ScrollControls() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Show controls when scrolled more than 160px
      setVisible(y > 160);

      // Check if near the very bottom (within 80px)
      setAtBottom(y + winHeight >= docHeight - 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (targetY: number, duration = 850) => {
    if (reduced) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    // Quintic ease-out curve: extremely soft and gradual deceleration as it approaches target
    const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuint(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToTop = () => {
    smoothScrollTo(0, 950);
  };

  const scrollToBottom = () => {
    const docHeight = document.documentElement.scrollHeight;
    smoothScrollTo(docHeight, 950);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.92 }}
          transition={springMove}
          aria-label="Page scroll navigation"
          className="fixed bottom-24 right-4 z-40 flex flex-col items-center gap-1 rounded-full border border-material-edge bg-material p-1.5 shadow-lift backdrop-blur-xl sm:bottom-6 sm:right-6"
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
