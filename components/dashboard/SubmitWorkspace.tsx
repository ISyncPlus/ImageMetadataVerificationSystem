"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Card from "../ui/Card";
import { Button } from "../ui/Button";
import StatusBadge from "../StatusBadge";
import CryptographicStream from "../ui/CryptographicStream";
import {
  Alert,
  Camera,
  Check,
  Clock,
  Copies,
  Doc,
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

/** Named so the narration can be shown as a route through the pipeline rather
 *  than one anonymous line of status text. */
const PIPELINE = [
  "Reading the file",
  "Extracting EXIF metadata",
  "Resolving location",
  "Checking against the ledger",
];

function CheckRow({
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
      className="flex items-start gap-3 py-3"
    >
      <span
        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${
          passed ? "bg-good-wash text-good" : "bg-warn-wash text-warn"
        }`}
      >
        {passed ? (
          <Check size={12} strokeWidth={2.6} />
        ) : (
          <Alert size={12} strokeWidth={2.6} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="t-footnote flex items-center gap-1.5 font-medium text-ink">
          <Icon size={13} className="shrink-0 text-ink-3" />
          {label}
        </span>
        {!passed ? (
          <span className="t-caption mt-0.5 block text-ink-2">{hint}</span>
        ) : null}
      </span>

      <span
        className={`t-mark shrink-0 pt-0.5 ${passed ? "text-good" : "text-warn"}`}
      >
        {passed ? "Pass" : "Fail"}
      </span>
    </motion.li>
  );
}

/**
 * The bench where a submission is examined.
 *
 * Three states share one surface, and the thumbnail travels between them with a
 * shared-element transition: the same photograph you dropped is the one being
 * scanned, and then the one attached to the verdict. Redrawing a new image at
 * each stage would break the thread the whole screen depends on.
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
  const activeStep = step ? PIPELINE.indexOf(step) : -1;

  return (
    <Card
      bezel
      mark="Bench 01"
      title="Submit evidence"
      subtitle="Original camera photograph — JPEG or PNG, up to 25 MB"
      actions={
        phase === "result" ? (
          <Button size="sm" variant="quiet" onClick={onReset}>
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
              className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-md border border-dashed px-6 py-14 text-center transition-colors duration-200 ${
                dragging
                  ? "border-accent bg-accent-wash"
                  : "border-line-strong hover:bg-well"
              }`}
            >
              {/* A specimen tray: graph paper, with registration marks at the
                  corners so the empty state still reads as a place where
                  something is meant to be laid down. */}
              <span
                aria-hidden
                className="grid-paper pointer-events-none absolute inset-0 opacity-60"
              />
              {[
                "left-3 top-3 border-l border-t",
                "right-3 top-3 border-r border-t",
                "left-3 bottom-3 border-b border-l",
                "right-3 bottom-3 border-b border-r",
              ].map((corner) => (
                <span
                  key={corner}
                  aria-hidden
                  className={`pointer-events-none absolute h-4 w-4 border-line-strong ${corner}`}
                />
              ))}

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
                  dragging && !reduced
                    ? { scale: 1.1, y: -3 }
                    : { scale: 1, y: 0 }
                }
                transition={springSnappy}
                className="relative flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-ink shadow-accent"
              >
                <Upload size={20} />
              </motion.span>

              <span className="relative">
                <span className="t-title-3 block text-ink">
                  {dragging ? "Release to read it" : "Drop a photo, or browse"}
                </span>
                <span className="t-footnote mx-auto mt-2 block max-w-xs text-pretty text-ink-2">
                  The file is read here, on this device. Only the resulting
                  record is filed — never the photograph.
                </span>
              </span>

              <span className="t-mark relative text-ink-3">
                JPEG · PNG · ≤ 25 MB
              </span>
            </label>

            <AnimatePresence initial={false}>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="t-footnote mt-3 flex items-start gap-2 rounded-sm border-l-2 border-bad bg-bad-wash px-3.5 py-2.5 text-bad"
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
            className="flex flex-col gap-6 py-4 sm:flex-row sm:items-center sm:gap-8"
          >
            <motion.div
              layoutId="submission-preview"
              transition={springMove}
              className="relative mx-auto aspect-square w-28 shrink-0 overflow-hidden rounded-sm bg-well ring-1 ring-line sm:mx-0"
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
              {/* A sheen travelling over the thumbnail reads as "being read"
                  without pretending to know real progress. */}
              {!reduced ? (
                <motion.span
                  aria-hidden
                  initial={{ y: "-120%" }}
                  animate={{ y: "120%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent"
                />
              ) : null}
            </motion.div>

            {/* The pipeline, named. A single spinner tells you to wait; a route
                tells you what is happening and how much of it is left. */}
            <ol className="ruled min-w-0 flex-1" aria-live="polite">
              {PIPELINE.map((name, index) => {
                const done = activeStep > index;
                const current = activeStep === index;
                return (
                  <li key={name} className="flex items-center gap-3 py-2">
                    <span
                      className={`t-num w-5 shrink-0 text-[0.6875rem] ${
                        current ? "text-accent" : "text-ink-3"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`t-footnote flex-1 truncate ${
                        current
                          ? "font-semibold text-ink"
                          : done
                            ? "text-ink-2"
                            : "text-ink-3"
                      }`}
                    >
                      {name}
                    </span>
                    {done ? (
                      <Check size={13} strokeWidth={2.6} className="text-good" />
                    ) : current ? (
                      <span className="blink h-1.5 w-1.5 rounded-full bg-accent" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                    )}
                  </li>
                );
              })}
              <li className="pt-2">
                <p className="t-num truncate text-[0.6875rem] text-ink-3">
                  {fileName}
                </p>
              </li>
            </ol>
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
            className="flex flex-col gap-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                layoutId="submission-preview"
                transition={springMove}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-well ring-1 ring-line"
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
                <StatusBadge status={entry.status} size="md" />
                <p className="t-footnote mt-2.5 truncate font-semibold text-ink">
                  {entry.fileName}
                </p>
                <p className="t-caption mt-1 text-pretty text-ink-2">
                  {entry.reason}
                </p>
              </div>
            </div>

            {offlineNotice ? (
              <p className="t-footnote flex items-start gap-2 rounded-sm border-l-2 border-warn bg-warn-wash px-3.5 py-2.5 text-warn">
                <Alert size={14} className="mt-0.5 shrink-0" />
                {offlineNotice}
              </p>
            ) : null}

            {duplicateOfOtherUser ? (
              <p className="t-footnote flex items-start gap-2 rounded-sm border-l-2 border-bad bg-bad-wash px-3.5 py-2.5 text-bad">
                <Copies size={14} className="mt-0.5 shrink-0" />
                This exact file was already submitted by a different student.
                Your reviewer can see both records.
              </p>
            ) : null}

            <div>
              <p className="t-mark text-ink-3">Verification matrix</p>
              <ul className="ruled mt-1 border-t border-rule">
                {CHECKS.map((check, index) => (
                  <CheckRow
                    key={check.key}
                    index={index}
                    label={check.label}
                    icon={check.icon}
                    result={verification[check.key]}
                    hint={check.failHint}
                  />
                ))}
              </ul>
            </div>

            <div>
              <p className="t-mark text-ink-3">Extracted telemetry</p>
              <dl className="ruled mt-1 border-y border-rule">
                {[
                  ["Captured", entry.metadata.captureTime ?? "Not available"],
                  ["Device", entry.metadata.device ?? "Not available"],
                  [
                    "Location",
                    entry.metadata.locationName ??
                      formatCoordinates(entry.metadata.gps) ??
                      "Not available",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-6 py-2.5"
                  >
                    <dt className="t-mark shrink-0 text-ink-3">{label}</dt>
                    <dd className="t-footnote text-right text-ink">{value}</dd>
                  </div>
                ))}
                <div className="py-2.5">
                  <dt className="t-mark text-ink-3">SHA-256</dt>
                  <dd className="mt-1.5">
                    <CryptographicStream hash={entry.hash} animate={false} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={onReport} arrow>
                <Doc size={15} />
                Print certificate
              </Button>
              <Button variant="quiet" onClick={onReset}>
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
