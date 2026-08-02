"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import type { ReactNode } from "react";
import { springSnappy } from "../../lib/motion";

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  render?: (value: T) => ReactNode;
  className?: string;
  segmentClassName?: string;
};

/**
 * The selection thumb is one element that travels between segments rather than
 * a highlight that blinks from one to the next, so the control keeps its
 * identity as it moves. Selection commits on pointer-down — waiting for the
 * release would read as lag.
 */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  render,
  className = "",
  segmentClassName = "px-4",
}: SegmentedControlProps<T>) {
  const thumbId = useId();
  const reduced = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-full border border-line bg-well p-1 ${className}`}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onPointerDown={() => {
              if (option !== value) onChange(option);
            }}
            onClick={() => {
              if (option !== value) onChange(option);
            }}
            className={`relative min-h-9 flex-1 rounded-full transition-colors duration-150 ${segmentClassName} ${
              active ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            {active ? (
              reduced ? (
                <span className="absolute inset-0 rounded-full bg-surface shadow-card" />
              ) : (
                <motion.span
                  layoutId={thumbId}
                  transition={springSnappy}
                  className="absolute inset-0 rounded-full bg-surface shadow-card"
                />
              )
            ) : null}
            <span
              className={`t-footnote relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                active ? "font-semibold" : "font-medium"
              }`}
            >
              {render ? render(option) : option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
