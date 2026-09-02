"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type NumberTickerProps = {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Tabular Rolling Odometer & Character Ticker
 * 
 * Each digit rolls smoothly into place using tabular-nums formatting.
 * Preserves accessibility under reduced motion by rendering static text.
 */
export default function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: NumberTickerProps) {
  const reduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  if (reduced) {
    return (
      <span className={`tabular-nums ${className}`}>
        {prefix}
        {displayValue}
        {suffix}
      </span>
    );
  }

  const str = String(displayValue);

  return (
    <span className={`inline-flex items-baseline tabular-nums font-mono ${className}`}>
      {prefix && <span className="opacity-80">{prefix}</span>}
      <span className="inline-flex overflow-hidden leading-none">
        {str.split("").map((char, index) => {
          const isDigit = /\d/.test(char);
          if (!isDigit) {
            return (
              <span key={`char-${index}`} className="inline-block">
                {char}
              </span>
            );
          }

          const num = parseInt(char, 10);

          return (
            <span
              key={`digit-${index}`}
              className="relative inline-block h-[1em] w-[0.62em] overflow-hidden"
            >
              <span
                className="absolute inset-0 flex flex-col transition-transform duration-700 ease-out"
                style={{
                  transform: `translateY(-${num * 10}%)`,
                  transitionDelay: `${index * 40}ms`,
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span
                    key={n}
                    className="flex h-[1em] items-center justify-center leading-none"
                  >
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
      {suffix && <span className="opacity-80">{suffix}</span>}
    </span>
  );
}
