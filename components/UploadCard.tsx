"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Card from "./ui/Card";
import { Alert, Hash, Upload } from "./ui/icons";
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
  /* dragenter/leave fire for every child, so nesting has to be counted. */
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
      title="Submit an image"
      subtitle="Hashing and EXIF inspection run on this device"
      actions={
        <span
          className={`t-caption inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
            isProcessing ? "bg-accent-wash text-accent" : "bg-well text-ink-2"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isProcessing ? "bg-accent" : "bg-ink-3"
            }`}
          />
          {isProcessing ? "Reading" : "Ready"}
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
        /* The zone answers the pointer throughout the drag, not only when the
           file lands. */
        animate={reduced ? {} : { scale: isOver ? 1.015 : 1 }}
        whileTap={reduced ? {} : { scale: 0.99 }}
        transition={springSnappy}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-9 text-center transition-colors duration-150 ${
          isOver
            ? "border-accent bg-accent-wash"
            : "border-line-strong bg-well hover:border-accent"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleInput}
          className="sr-only"
        />
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 ${
            isOver
              ? "bg-accent text-accent-ink"
              : "bg-surface text-accent shadow-card"
          }`}
        >
          <Upload size={20} />
        </span>
        <span>
          <span className="t-callout block font-semibold text-ink">
            {isOver ? "Release to verify" : "Drag an image here"}
          </span>
          <span className="t-footnote mt-0.5 block text-ink-2">
            or click to choose a JPEG or PNG
          </span>
        </span>
      </motion.label>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={fade}
            role="alert"
            className="t-footnote flex items-start gap-2 rounded-xl bg-bad-wash px-3.5 py-3 text-bad"
          >
            <Alert size={16} strokeWidth={1.8} className="mt-px shrink-0" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3">
        <div
          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-well ${
            isProcessing ? "shimmer" : ""
          }`}
        >
          {previewUrl ? (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springMove}
              className="h-full w-full"
            >
              <Image
                src={previewUrl}
                alt={fileName ?? "Selected image"}
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-cover"
              />
            </motion.div>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-footnote truncate font-semibold text-ink">
            {fileName ?? "No image selected"}
          </p>
          <p className="t-caption mt-0.5 flex items-center gap-1 text-ink-2">
            {hash ? (
              <>
                <Hash size={12} className="shrink-0" />
                <span className="truncate font-mono">{hash.slice(0, 24)}…</span>
              </>
            ) : (
              "Its SHA-256 fingerprint will appear here"
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
