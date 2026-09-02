"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type CryptographicStreamProps = {
  hash: string;
  className?: string;
  animate?: boolean;
};

const HEX_CHARS = "0123456789abcdef";

type Stream = { locked: number; text: string };

/**
 * A SHA-256 digest resolving into place.
 *
 * Characters churn through random hexadecimal until each position locks to its
 * true value, left to right — the visual grammar of a checksum being computed
 * rather than merely displayed. The point is legibility of *state*: you can see
 * at a glance how much of the digest is settled.
 *
 * One piece of state, advanced from inside the interval. An earlier version
 * kept the locked index and the rendered text separately, which meant two
 * renders per frame and a cascading update between them.
 */
export default function CryptographicStream({
  hash,
  className = "",
  animate = true,
}: CryptographicStreamProps) {
  const reduced = useReducedMotion();
  const idle = reduced || !animate;

  const [stream, setStream] = useState<Stream>(() => ({
    locked: idle ? hash.length : 0,
    text: hash,
  }));

  /* Resetting during render when the input changes is React's documented way
     to derive state from props — an effect for this would paint the previous
     hash for one frame before correcting itself. */
  const [seenHash, setSeenHash] = useState(hash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    setStream({ locked: idle ? hash.length : 0, text: hash });
  }

  useEffect(() => {
    if (idle) return;

    const interval = setInterval(() => {
      setStream((previous) => {
        /* Returning the identical object once settled lets React bail out of
           the render entirely, so the timer costs nothing while it winds down. */
        if (previous.locked >= hash.length) return previous;

        const locked = Math.min(previous.locked + 2, hash.length);
        if (locked === hash.length) return { locked, text: hash };

        let churn = "";
        for (let index = locked; index < hash.length; index += 1) {
          churn += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
        return { locked, text: hash.slice(0, locked) + churn };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [hash, idle]);

  const settled = stream.locked >= hash.length;

  return (
    <span
      className={`t-num inline-flex flex-wrap items-baseline gap-x-1 text-[0.6875rem] leading-relaxed ${className}`}
      title={hash}
    >
      <span className="break-all text-ink">{stream.text.slice(0, stream.locked)}</span>
      {!settled ? (
        <>
          <span className="break-all text-ink-3">
            {stream.text.slice(stream.locked)}
          </span>
          <span aria-hidden className="ml-0.5 inline-block h-3 w-[2px] bg-accent" />
        </>
      ) : null}
    </span>
  );
}
