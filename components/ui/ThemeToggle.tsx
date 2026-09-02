"use client";

import { motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "./icons";
import { springSnappy } from "../../lib/motion";
import { useTheme } from "../../lib/useTheme";

/**
 * One control, one glyph: it shows the appearance you are in, and pressing it
 * rotates that glyph out as the other rotates in. Until it is first pressed the
 * app is still following the system.
 *
 * Both icons stay mounted and are driven by `animate` with `initial={false}`,
 * so the first paint is simply correct — no enter/exit pass on load.
 */
export default function ThemeToggle() {
  const { resolved, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const isDark = resolved === "dark";
  const next = isDark ? "light" : "dark";

  const glyph = (visible: boolean, leaving: number) =>
    reduced
      ? { opacity: visible ? 1 : 0 }
      : {
          opacity: visible ? 1 : 0,
          rotate: visible ? 0 : leaving,
          scale: visible ? 1 : 0.5,
        };

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} appearance`}
      whileTap={reduced ? { opacity: 0.7 } : { scale: 0.92 }}
      transition={springSnappy}
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-150 hover:border-line-strong hover:text-ink"
    >
      <motion.span
        initial={false}
        animate={glyph(!isDark, -80)}
        transition={springSnappy}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun size={15} />
      </motion.span>
      <motion.span
        initial={false}
        animate={glyph(isDark, 80)}
        transition={springSnappy}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon size={15} />
      </motion.span>
    </motion.button>
  );
}
