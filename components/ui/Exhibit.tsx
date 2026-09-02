"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type ExhibitProps = {
  /** Two-digit file index. Set alongside the ghost numeral in the margin. */
  index?: string;
  /** The mono stamp — what kind of thing this section is. */
  mark: string;
  title: ReactNode;
  /** Sits in the outer column, deliberately off the title's baseline. */
  lede?: ReactNode;
  /** Right-hand end of the header rule: a link, a control, a reading. */
  action?: ReactNode;
  /** Small mono note pinned to the right of the rule. */
  meta?: string;
  className?: string;
};

/**
 * The header of an exhibit.
 *
 * Three moves make it read as a case file rather than a marketing section:
 * the mono stamp and index that name the exhibit, the hairline that runs the
 * full width and draws itself in as the section arrives, and the deliberate
 * split — display type on the left, the explanatory lede in the outer column
 * and dropped off its baseline. Symmetry is what makes section headers
 * forgettable; this one is off-balance on purpose.
 */
export default function Exhibit({
  index,
  mark,
  title,
  lede,
  action,
  meta,
  className = "",
}: ExhibitProps) {
  const reduced = useReducedMotion();

  return (
    <header className={`relative ${className}`}>
      {/* Stamp line */}
      <div className="flex items-center gap-4">
        {index ? (
          <span className="t-mark shrink-0 text-accent">{index}</span>
        ) : null}
        <span className="t-mark shrink-0 text-ink-2">{mark}</span>

        <motion.span
          aria-hidden
          initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
          whileInView={reduced ? { opacity: 1 } : { scaleX: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-left bg-rule"
        />

        {meta ? (
          <span className="t-mark hidden shrink-0 text-ink-3 sm:block">{meta}</span>
        ) : null}
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {/* Split body: the title takes the reading column, the lede hangs in the
          outer one and starts lower, so the eye lands on the type first. */}
      <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:gap-10">
        <h2 className="t-headline text-balance text-ink lg:col-span-7">{title}</h2>
        {lede ? (
          <div className="t-body max-w-prose text-pretty text-ink-2 lg:col-span-5 lg:self-end lg:pb-1">
            {lede}
          </div>
        ) : null}
      </div>

      {/* The oversized outlined figure that marks the exhibit in the margin.
          Hidden from assistive tech: the index above already says it. */}
      {index ? (
        <span
          aria-hidden
          className="numeral-ghost pointer-events-none absolute -top-10 right-0 hidden select-none text-[7rem] leading-none xl:block"
        >
          {index}
        </span>
      ) : null}
    </header>
  );
}
