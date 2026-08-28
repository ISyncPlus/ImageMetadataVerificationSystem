"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Card from "../ui/Card";
import { Button } from "../ui/Button";
import StatusBadge from "../StatusBadge";
import {
  Alert,
  Camera,
  Check,
  Clock,
  Copies,
  Doc,
  Hash,
  Pin,
  Upload,
} from "../ui/icons";
import { fade, springMove, springSnappy, stagger } from "../../lib/motion";
import { formatCoordinates } from "../../lib/format";
import type { CheckResult, HistoryEntry } from "../../lib/types";

export type WorkspacePhase = "idle" | "working" | "result";

type SubmitWorkspaceProps = {
  phase: WorkspacePhase;
  /** Full-resolution preview, held in memory only — never uploaded. */
  previewUrl: string | null;
  fileName: string | null;
  /** Narration of the current step, e.g. "Extracting EXIF metadata". */
  step: string | null;
  error: string | null;
  entry: HistoryEntry | null;
  /** Set when the server found this hash under a *different* student. */
  duplicateOfOtherUser: boolean;
  /**
   * The shown verdict came from this device because the server could not be
   * reached, so it is not filed and cannot know about duplicates.
   */
  offlineNotice: string | null;
  onFile: (file: File) => void;
  onReset: () => void;
  onReport: () => void;
};

const CHECKS: Array<{
  key: "timeCheck" | "locationCheck" | "deviceCheck" | "duplicateCheck";
  label: string;
  icon: typeof Clock;
  failHint: string;
}> = [
  {
    key: "timeCheck",
    label: "Capture time",
    icon: Clock,
    failHint: "No original timestamp in the file",
  },
  {
    key: "locationCheck",
    label: "GPS location",
    icon: Pin,
    failHint: "No usable coordinates recorded",
  },
  {
    key: "deviceCheck",
    label: "Device",
    icon: Camera,
    failHint: "No camera make or model recorded",
  },
  {
    key: "duplicateCheck",
    label: "Not a duplicate",
    icon: Copies,
    failHint: "This file has been submitted before",
  },
];

function CheckPill({
  label,
  icon: Icon,
  result,
  hint,
  index,
}: {
  label: string;
  icon: typeof Clock;
  result: CheckResult;
  hint: string;
  index: number;
}) {
  const reduced = useReducedMotion();
  const passed = result === "Pass";

  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springMove, delay: stagger(index, 0.06) }}
      className={`flex items-start gap-2.5 rounded-xl border p-3 ${
        passed ? "border-good/25 bg-good-wash" : "border-warn/25 bg-warn-wash"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          passed ? "bg-good-mark/15 text-good" : "bg-warn-mark/15 text-warn"
        }`}
      >
        {passed ? (
          <Check size={12} strokeWidth={2.5} />
        ) : (
          <Alert size={12} strokeWidth={2.5} />
        )}
      </span>
      <span className="min-w-0">
        <span className="t-footnote flex items-center gap-1.5 font-medium text-ink">
          <Icon size={13} className="shrink-0 text-ink-3" />
          {label}
        </span>
        {!passed ? (
          <span className="t-caption mt-0.5 block text-ink-2">{hint}</span>
        ) : null}
      </span>
    </motion.li>
  );
}

/**
 * One surface that carries a submission from drop to verdict.
 *
 * The three phases share a card rather than swapping between three of them, so
 * the panel keeps its identity as the work progresses — the thumbnail that
 * appears while analysing is the same element that anchors the result.
 */
export default function SubmitWorkspace({
  phase,
  previewUrl,
  fileName,
  step,
  error,
  entry,
  duplicateOfOtherUser,
  offlineNotice,
  onFile,
  onReset,
  onReport,
}: SubmitWorkspaceProps) {
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // Drag events fire per child element; a counter avoids the highlight
  // flickering as the pointer crosses the zone's own children.
  const dragDepth = useRef(0);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const verification = entry?.verification ?? null;

  return (
    <Card
      title="Submit evidence"
      subtitle="Original camera photo — JPEG or PNG"
      className="overflow-hidden"
      actions={
        phase === "result" ? (
          <Button size="sm" onClick={onReset}>
            <Upload size={14} />
            New check
          </Button>
        ) : null
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {/* ------------------------------------------------------- idle */}
        {phase === "idle" ? (
          <motion.div
            key="idle"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={fade}
          >
            <label
              onDragEnter={(event) => {
                event.preventDefault();
                dragDepth.current += 1;
                setDragging(true);
              }}
              onDragLeave={() => {
                dragDepth.current -= 1;
                if (dragDepth.current <= 0) setDragging(false);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150 ${
                dragging
                  ? "border-accent bg-accent-wash"
                  : "border-line hover:border-line-strong hover:bg-well"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onFile(file);
                }}
              />
              <motion.span
                animate={
                  dragging && !reduced ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }
                }
                transition={springSnappy}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-wash text-accent"
              >
                <Upload size={20} />
              </motion.span>
              <span>
                <span className="t-callout block font-medium text-ink">
                  {dragging ? "Release to check" : "Drop a photo, or browse"}
                </span>
                <span className="t-caption mt-1 block text-ink-2">
                  Metadata is read on your device. The original file is never
                  uploaded.
                </span>
              </span>
            </label>

            <AnimatePresence initial={false}>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="t-footnote mt-3 flex items-start gap-1.5 rounded-xl border border-bad/30 bg-bad-wash px-3.5 py-2.5 text-bad"
                >
                  <Alert size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {/* ---------------------------------------------------- working */}
        {phase === "working" ? (
          <motion.div
            key="working"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={fade}
            className="flex flex-col items-center gap-4 py-6"
          >
            <motion.div
              layoutId="submission-preview"
              transition={springMove}
              className="relative h-28 w-28 overflow-hidden rounded-2xl border border-line bg-well"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
              {/* A sheen travelling over the thumbnail reads as "being read",
                  without pretending to know real progress. */}
              {!reduced ? (
                <motion.span
                  aria-hidden
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
              ) : null}
            </motion.div>

            <div className="text-center" aria-live="polite">
              <p className="t-callout font-medium text-ink">
                {step ?? "Analysing"}
              </p>
              <p className="t-caption mt-1 truncate text-ink-2">{fileName}</p>
            </div>
          </motion.div>
        ) : null}

        {/* ----------------------------------------------------- result */}
        {phase === "result" && entry && verification ? (
          <motion.div
            key="result"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={springMove}
            className="flex flex-col gap-5"
          >
            <div className="flex items-start gap-4">
              <motion.div
                layoutId="submission-preview"
                transition={springMove}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-line bg-well"
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
              </motion.div>

              <div className="min-w-0 flex-1">
                <StatusBadge status={entry.status} />
                <p className="t-footnote mt-2 truncate font-medium text-ink">
                  {entry.fileName}
                </p>
                <p className="t-caption mt-1 text-ink-2">{entry.reason}</p>
              </div>
            </div>

            {offlineNotice ? (
              <p className="t-footnote flex items-start gap-2 rounded-xl border border-warn/30 bg-warn-wash px-3.5 py-2.5 text-warn">
                <Alert size={14} className="mt-0.5 shrink-0" />
                {offlineNotice}
              </p>
            ) : null}

            {duplicateOfOtherUser ? (
              <p className="t-footnote flex items-start gap-2 rounded-xl border border-bad/30 bg-bad-wash px-3.5 py-2.5 text-bad">
                <Copies size={14} className="mt-0.5 shrink-0" />
                This exact file was already submitted by a different student.
                Your reviewer can see both records.
              </p>
            ) : null}

            <ul className="grid gap-2 sm:grid-cols-2">
              {CHECKS.map((check, index) => (
                <CheckPill
                  key={check.key}
                  index={index}
                  label={check.label}
                  icon={check.icon}
                  result={verification[check.key]}
                  hint={check.failHint}
                />
              ))}
            </ul>

            <dl className="grid gap-x-4 gap-y-2.5 rounded-xl border border-line bg-well p-4 sm:grid-cols-2">
              <div>
                <dt className="t-caption text-ink-3">Captured</dt>
                <dd className="t-footnote text-ink">
                  {entry.metadata.captureTime ?? "Not available"}
                </dd>
              </div>
              <div>
                <dt className="t-caption text-ink-3">Device</dt>
                <dd className="t-footnote text-ink">
                  {entry.metadata.device ?? "Not available"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="t-caption text-ink-3">Location</dt>
                <dd className="t-footnote text-ink">
                  {entry.metadata.locationName ??
                    formatCoordinates(entry.metadata.gps) ??
                    "Not available"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="t-caption text-ink-3">SHA-256</dt>
                <dd className="t-caption break-all font-mono text-ink-2">
                  {entry.hash}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={onReport}>
                <Doc size={15} />
                Print certificate
              </Button>
              <Button onClick={onReset}>
                <Upload size={15} />
                Check another
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
