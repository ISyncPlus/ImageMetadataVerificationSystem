"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";

type TickerProps = {
  value: number;
  className?: string;
  suffix?: string;
};

/**
 * A number that springs to its new value instead of snapping. Digits are
 * tabular so the surrounding layout never shifts as it counts, and the DOM node
 * is written directly so a per-frame value change doesn't re-render React.
 */
export default function Ticker({ value, className = "", suffix = "" }: TickerProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(0, { bounce: 0, duration: 0.7 });

  useEffect(() => {
    if (reduced) {
      spring.jump(value);
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }
    spring.set(value);
  }, [value, spring, reduced, suffix]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
  });

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {`${value}${suffix}`}
    </span>
  );
}
