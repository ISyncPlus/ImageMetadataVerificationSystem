"use client";

import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full pass. Longer = calmer. */
  duration?: number;
  className?: string;
};

/**
 * A seamless kinetic band.
 *
 * The track holds the content twice and translates exactly -50%, so the loop
 * has no seam and no measurement step. It pauses on hover — a band that keeps
 * moving while you are trying to read it is decoration working against
 * content. Duplicated content is hidden from assistive tech; screen readers
 * get one copy.
 */
export default function Marquee({
  children,
  duration = 42,
  className = "",
}: MarqueeProps) {
  return (
    <div
      className={`marquee-host relative overflow-hidden ${className}`}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>

      {/* Feathered ends, so the band reads as continuing past the page rather
          than being chopped at the edge. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas to-transparent"
      />
    </div>
  );
}
