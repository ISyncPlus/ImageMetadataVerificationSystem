"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Card from "./ui/Card";
import { Alert, Copies, Hash, Upload } from "./ui/icons";
import { fade, springMove, springSnappy } from "../lib/motion";

type UploadCardProps = {
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  fileName: string | null;
  hash: string | null;
  onFile: (file: File) => void;
};

export default function UploadCard({
  isProcessing,
  error,
  previewUrl,
  fileName,
  hash,
  onFile,
}: UploadCardProps) {
  const reduced = useReducedMotion();
  const [isOver, setIsOver] = useState(false);
  const depth = useRef(0);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    depth.current = 0;
    setIsOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <Card
      title="Upload Coursework Image"
      subtitle="Submit original uncompressed JPEG or PNG camera file"
      actions={
        <span
          className={`t-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
            isProcessing
              ? "bg-accent-wash text-accent"
              : previewUrl
              ? "bg-good-wash text-good"
              : "bg-well text-ink-2"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isProcessing
                ? "bg-accent animate-pulse"
                : previewUrl
                ? "bg-good-mark"
                : "bg-ink-3"
            }`}
          />
          {isProcessing ? "Inspecting EXIF…" : previewUrl ? "Loaded" : "Ready"}
        </span>
      }
      bodyClassName="flex flex-col gap-4"
    >
      <motion.label
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current += 1;
          setIsOver(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => {
          depth.current = Math.max(0, depth.current - 1);
          if (depth.current === 0) setIsOver(false);
        }}
        onDrop={handleDrop}
        animate={reduced ? {} : { scale: isOver ? 1.01 : 1 }}
        whileTap={reduced ? {} : { scale: 0.99 }}
        transition={springSnappy}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3.5 rounded-xl border border-dashed px-6 py-9 text-center transition-colors duration-150 ${
          isOver
            ? "border-accent bg-accent-wash"
            : "border-line-strong bg-well hover:border-accent hover:bg-surface-2"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleInput}
          className="sr-only"
        />
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-150 ${
            isOver
              ? "bg-accent text-accent-ink"
              : "bg-surface text-accent shadow-card border border-line"
          }`}
        >
          <Upload size={22} />
        </span>
        <div>
          <span className="t-callout block font-semibold text-ink">
            {isOver ? "Drop image to verify" : "Drag & drop camera image here"}
          </span>
          <span className="t-footnote mt-1 block text-ink-2">
            or browse local files (JPEG / PNG from camera)
          </span>
        </div>
      </motion.label>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            key="error"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={fade}
            role="alert"
            className="t-footnote flex items-start gap-2.5 rounded-xl bg-bad-wash px-3.5 py-3 text-bad border border-bad/20"
          >
            <Alert size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Inspection Note</p>
              <p className="mt-0.5 opacity-90">{error}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex items-center gap-3.5 rounded-xl border border-line bg-surface-2 p-3.5">
        <div
          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-well border border-line ${
            isProcessing ? "shimmer" : ""
          }`}
        >
          {previewUrl ? (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springMove}
              className="h-full w-full relative"
            >
              <Image
                src={previewUrl}
                alt={fileName ?? "Selected image"}
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 pointer-events-none bg-accent/20 animate-pulse" />
              )}
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <Upload size={18} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-footnote truncate font-semibold text-ink">
            {fileName ?? "No file selected"}
          </p>
          <div className="t-caption mt-0.5 flex items-center gap-1.5 text-ink-2">
            {hash ? (
              <>
                <Hash size={12} className="shrink-0 text-accent" />
                <span className="truncate font-mono font-medium text-ink-2">
                  {hash.slice(0, 16)}…{hash.slice(-8)}
                </span>
              </>
            ) : (
              <span className="text-ink-3">SHA-256 fingerprint computed on drop</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
