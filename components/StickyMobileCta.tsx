"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ShieldCheck, Zap } from "./ui/icons";
import { springMove } from "../lib/motion";

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Show only after user starts scrolling down (e.g. past hero)
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Don't show if at very top or at very bottom footer
      if (scrollY > 180 && scrollY + windowHeight < documentHeight - 120) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={reduced ? { duration: 0.15 } : springMove}
          className="fixed bottom-4 left-4 right-4 z-50 flex justify-center sm:hidden"
        >
          <div className="flex w-full max-w-md items-center justify-between gap-2.5 rounded-full border border-material-edge bg-surface/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 pl-1 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                <ShieldCheck size={16} />
              </span>
              <div className="min-w-0">
                <p className="t-caption font-semibold text-ink truncate leading-tight">
                  Provenance Audit
                </p>
                <p className="text-[10px] text-accent font-medium leading-tight flex items-center gap-0.5">
                  <Zap size={10} /> &lt;50ms Local
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/login"
                className="t-caption rounded-full bg-accent px-3.5 py-1.5 font-semibold text-accent-ink shadow-sm transition-transform active:scale-95"
              >
                Verify Now
              </Link>
              <Link
                href="/student"
                className="t-caption rounded-full border border-line bg-surface-2 px-3 py-1.5 font-medium text-ink transition-colors hover:bg-surface active:scale-95"
              >
                Inspector
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
