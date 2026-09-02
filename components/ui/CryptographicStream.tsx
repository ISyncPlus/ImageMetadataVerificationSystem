"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type CryptographicStreamProps = {
  hash: string;
  className?: string;
  animate?: boolean;
};

const HEX_CHARS = "0123456789abcdef";

/**
 * Cryptographic Hash Stream & Checksum Lock
 * 
 * An animated SHA-256 byte stream where hexadecimal characters cascade
 * through rapid random calculations before locking into their verified value.
 */
export default function CryptographicStream({
  hash,
  className = "",
  animate = true,
}: CryptographicStreamProps) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(hash);
  const [lockedIndex, setLockedIndex] = useState(animate ? 0 : hash.length);

  useEffect(() => {
    if (reduced || !animate) {
      setDisplayed(hash);
      setLockedIndex(hash.length);
      return;
    }

    setLockedIndex(0);
    const interval = setInterval(() => {
      setLockedIndex((prev) => {
        if (prev >= hash.length) {
          clearInterval(interval);
          return hash.length;
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [hash, animate, reduced]);

  useEffect(() => {
    if (reduced || !animate || lockedIndex >= hash.length) {
      setDisplayed(hash);
      return;
    }

    const scrambling = setInterval(() => {
      setDisplayed((prev) => {
        const lockedPart = hash.slice(0, lockedIndex);
        let randomPart = "";
        for (let i = lockedIndex; i < hash.length; i++) {
          randomPart += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
        return lockedPart + randomPart;
      });
    }, 40);

    return () => clearInterval(scrambling);
  }, [lockedIndex, hash, animate, reduced]);

  return (
    <span className={`font-mono text-xs break-all tracking-wider tabular-nums ${className}`}>
      <span className="text-emerald-500 font-semibold">{displayed.slice(0, lockedIndex)}</span>
      <span className="opacity-45 text-ink-3">{displayed.slice(lockedIndex)}</span>
    </span>
  );
}
