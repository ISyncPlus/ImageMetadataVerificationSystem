"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "./ui/icons";
import { BrandMark } from "./ui/BrandLogo";
import { springMove } from "../lib/motion";

/**
 * The small-screen action bar.
 *
 * It stays out of the way at the top of the page — where the hero's own call to
 * action is still on screen and a duplicate would be noise — and again at the
 * very bottom, where the closing call to action has taken over. It exists for
 * the long middle, where the page has scrolled past both.
 */
export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const viewport = window.innerHeight;
      const page = document.documentElement.scrollHeight;
      setVisible(y > 220 && y + viewport < page - 220);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
          transition={reduced ? { duration: 0.15 } : springMove}
          className="fixed inset-x-4 bottom-4 z-40 sm:hidden"
        >
          <div className="material material-pill flex items-center justify-between gap-3 rounded-full border border-material-edge py-1.5 pl-4 pr-1.5 backdrop-blur-xl backdrop-saturate-[180%]">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="shrink-0 text-ink">
                <BrandMark size={18} />
              </span>
              <span className="min-w-0">
                <span className="t-mark on-material block truncate text-ink">
                  Check a photo
                </span>
                <span className="t-mark block truncate text-[0.5625rem] text-ink-3">
                  Reads on device
                </span>
              </span>
            </span>

            <Link
              href="/login"
              className="group flex shrink-0 items-center gap-2 rounded-full bg-accent py-1.5 pl-4 pr-1.5 text-accent-ink shadow-accent transition-transform active:scale-[0.97]"
            >
              <span className="t-mark">Start</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15">
                <ArrowRight size={12} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
