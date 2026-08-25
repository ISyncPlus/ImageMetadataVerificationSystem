"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Card from "./ui/Card";
import StatusBadge from "./StatusBadge";
import { Button } from "./ui/Button";
import { Alert, Camera, Check, Clock, Copies, Doc, Pin, ShieldCheck } from "./ui/icons";
import { springMove, stagger } from "../lib/motion";
import type { VerificationResult } from "../lib/types";

type VerificationCardProps = {
  verification: VerificationResult | null;
  onDownloadReport?: () => void;
};

const CHECKS: Array<{
  key: "timeCheck" | "locationCheck" | "deviceCheck" | "duplicateCheck";
  label: string;
  sublabel: string;
  icon: typeof Clock;
}> = [
  { key: "timeCheck", label: "Capture Time", sublabel: "Within lab schedule", icon: Clock },
  { key: "locationCheck", label: "GPS Coordinates", sublabel: "Valid physical coordinates", icon: Pin },
  { key: "deviceCheck", label: "Hardware EXIF", sublabel: "Camera make & model", icon: Camera },
  { key: "duplicateCheck", label: "Duplicate Check", sublabel: "SHA-256 originality", icon: Copies },
];

export default function VerificationCard({
  verification,
  onDownloadReport,
}: VerificationCardProps) {
  const reduced = useReducedMotion();

  return (
    <Card
      title="Verification Audit"
      subtitle="Four automated cryptographic and telemetry checks"
      actions={
        verification && onDownloadReport ? (
          <Button size="sm" variant="primary" onClick={onDownloadReport}>
            <Doc size={14} />
            Print Report
          </Button>
        ) : undefined
      }
      bodyClassName="flex flex-col"
    >
      <AnimatePresence mode="wait" initial={false}>
        {verification ? (
          <motion.div
            key={verification.status + verification.reason}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={springMove}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5">
              <div className="flex items-center gap-2.5">
                <StatusBadge status={verification.status} size="md" />
                <span className="t-caption font-medium text-ink-2">
                  {verification.reused ? "Duplicate Match" : "Unique Submission"}
                </span>
              </div>
              <span className="t-caption font-mono text-ink-3">
                {verification.status === "Verified" ? "4/4 PASS" : "FLAGGED"}
              </span>
            </div>

            <p className="t-footnote font-medium text-ink-2 bg-well p-3 rounded-xl border border-line">
              {verification.reason}
            </p>

            <ul className="flex flex-col gap-2">
              {CHECKS.map(({ key, label, sublabel, icon: Glyph }, index) => {
                const passed = verification[key] === "Pass";
                return (
                  <motion.li
                    key={key}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springMove, delay: stagger(index) }}
                    className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5 border border-line"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          passed ? "bg-good-wash text-good" : "bg-bad-wash text-bad"
                        }`}
                      >
                        <Glyph size={14} />
                      </div>
                      <div>
                        <p className="t-footnote font-semibold text-ink">{label}</p>
                        <p className="t-caption text-ink-3">{sublabel}</p>
                      </div>
                    </div>

                    <span
                      className={`t-caption inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                        passed ? "bg-good-wash text-good" : "bg-bad-wash text-bad"
                      }`}
                    >
                      {passed ? (
                        <Check size={12} strokeWidth={2.6} />
                      ) : (
                        <Alert size={12} strokeWidth={2.4} />
                      )}
                      {verification[key].toUpperCase()}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springMove}
            className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-well text-ink-3 border border-line">
              <ShieldCheck size={24} />
            </span>
            <div>
              <p className="t-callout font-semibold text-ink">Awaiting Submission</p>
              <p className="t-caption max-w-xs text-ink-2 mt-0.5">
                Drop an image file to trigger the automatic 4-rule provenance audit.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
