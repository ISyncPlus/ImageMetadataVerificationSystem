"use client";

import { useState } from "react";
import { Copy, Check } from "./icons";
import { cn } from "../../lib/utils";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export default function CopyButton({ text, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied to clipboard" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-mono text-ink-2 transition-colors hover:border-accent-edge hover:text-ink active:scale-95",
        copied && "border-good bg-good-wash text-good",
        className
      )}
    >
      {copied ? (
        <>
          <Check size={13} className="text-good" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
