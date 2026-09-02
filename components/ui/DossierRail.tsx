"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

export type RailMark = {
  /** id of the section this mark tracks. */
  id: string;
  /** Two digits. The file index, not a count. */
  index: string;
  label: string;
};

type DossierRailProps = {
  /** Vertical stamp running down the top of the rail. */
  stamp?: string;
  marks?: readonly RailMark[];
};

/**
 * The index rail.
 *
 * A case file is legible because its spine tells you where you are before you
 * read a word: which file, how far in, what section. This is that spine —
 * fixed to the page's left edge, with the reading column's grid reserving its
 * width so nothing ever slides underneath it.
 *
 * It is scroll-*driven*, not scroll-triggered: the fill tracks position
 * continuously rather than firing at thresholds, so it reads as a measurement
 * of the document instead of an animation about it. Below `lg` the page has no
 * margin to spend on a rail, so it is not rendered at all — the exhibit
 * headers carry the same index marks inline.
 */
export default function DossierRail({
  stamp = "Provenance — Case File",
  marks = [],
}: DossierRailProps) {
  const { scrollYProgress } = useScroll();
  const [activeId, setActiveId] = useState<string | null>(null);

  /* The raw progress value is exact but twitchy under a trackpad. A light
     spring smooths the fill without lagging behind the scroll position. */
  const fill = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.0008,
  });

  const percent = useTransform(scrollYProgress, (value) =>
    String(Math.round(value * 100)).padStart(2, "0")
  );

  useEffect(() => {
    if (marks.length === 0) return;

    const elements = marks
      .map((mark) => document.getElementById(mark.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    /* A band across the middle of the viewport: whichever section is crossing
       it owns the rail. Thresholds at the edges would flicker between two
       sections at every boundary. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        setActiveId(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [marks]);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-19 flex-col items-center justify-between border-r border-rule py-5 lg:flex"
      style={{ width: "4.75rem" }}
    >
      {/* Datum mark — the origin tile from the brand, reduced to its atom. */}
      <div className="flex flex-col items-center gap-4">
        <span className="h-2 w-2 rounded-[1px] bg-accent" />
        <span className="rail-stamp t-mark whitespace-nowrap text-ink-3">
          {stamp}
        </span>
      </div>

      {/* The measured spine. */}
      <div className="relative flex flex-1 flex-col items-center py-6">
        <div className="relative h-full w-px bg-rule">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-accent"
            style={{ height: "100%", scaleY: fill }}
          />

          {/* Ruler graduations. Purely a reading aid for the fill — they give
              the progress line something to be measured against. */}
          <div className="absolute -left-1 top-0 flex h-full flex-col justify-between">
            {Array.from({ length: 11 }).map((_, tick) => (
              <span
                key={tick}
                className={`block h-px bg-line-strong ${
                  tick % 5 === 0 ? "w-2.5" : "w-1.5"
                }`}
              />
            ))}
          </div>

          {/* Section marks, spaced along the spine. */}
          {marks.length > 0 ? (
            <div className="absolute inset-y-0 left-0 flex flex-col justify-around">
              {marks.map((mark) => {
                const active = mark.id === activeId;
                return (
                  <span key={mark.id} className="relative flex items-center">
                    <motion.span
                      animate={{ scale: active ? 1 : 0.55, opacity: active ? 1 : 0.45 }}
                      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                      className={`-ml-[3.5px] block h-[7px] w-[7px] rounded-full ${
                        active ? "bg-accent" : "bg-ink-3"
                      }`}
                    />
                    <motion.span
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, x: active ? 0 : -4 }}
                      transition={{ duration: 0.2 }}
                      className="t-mark absolute left-3 whitespace-nowrap text-[0.5625rem] text-accent"
                    >
                      {mark.index}
                    </motion.span>
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Read-out. Tabular mono, so the digits do not jitter as they climb. */}
      <div className="flex flex-col items-center gap-1">
        <motion.span className="t-num text-[0.8125rem] font-medium text-ink">
          {percent}
        </motion.span>
        <span className="t-mark text-[0.5625rem] text-ink-3">PCT</span>
      </div>
    </aside>
  );
}
