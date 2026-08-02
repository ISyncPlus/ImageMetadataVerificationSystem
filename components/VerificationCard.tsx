"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Card from "./ui/Card";
import StatusBadge from "./StatusBadge";
import { Button } from "./ui/Button";
import { Alert, Camera, Check, Clock, Copies, Doc, Pin } from "./ui/icons";
import { springMove, stagger } from "../lib/motion";
import type { VerificationResult } from "../lib/types";

type VerificationCardProps = {
  verification: VerificationResult | null;
  onDownloadReport?: () => void;
};

const CHECKS: Array<{
  key: "timeCheck" | "locationCheck" | "deviceCheck" | "duplicateCheck";
  label: string;
  icon: typeof Clock;
}> = [
  { key: "timeCheck", label: "Capture time", icon: Clock },
  { key: "locationCheck", label: "Location", icon: Pin },
  { key: "deviceCheck", label: "Device", icon: Camera },
  { key: "duplicateCheck", label: "Not a duplicate", icon: Copies },
];

export default function VerificationCard({
  verification,
  onDownloadReport,
}: VerificationCardProps) {
  const reduced = useReducedMotion();

  return (
    <Card
      title="Verification result"
      subtitle="Four objective checks, no visual judgement"
      actions={
        verification && onDownloadReport ? (
          <Button size="sm" onClick={onDownloadReport}>
            <Doc size={15} />
            Report
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
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={verification.status} size="md" />
              <span className="t-caption text-ink-2">
                {verification.reused ? "Seen before" : "First submission"}
              </span>
            </div>

            <p className="t-callout text-ink-2">{verification.reason}</p>

            <ul className="flex flex-col gap-1.5">
              {CHECKS.map(({ key, label, icon: Glyph }, index) => {
                const passed = verification[key] === "Pass";
                return (
                  <motion.li
                    key={key}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springMove, delay: stagger(index) }}
                    className="flex items-center gap-2.5 rounded-lg bg-well px-3 py-2"
                  >
                    <Glyph size={15} className="shrink-0 text-ink-3" />
                    <span className="t-footnote flex-1 text-ink">{label}</span>
                    <span
                      className={`t-caption inline-flex items-center gap-1 font-semibold ${
                        passed ? "text-good" : "text-bad"
                      }`}
                    >
                      {passed ? (
                        <Check size={13} strokeWidth={2.4} />
                      ) : (
                        <Alert size={13} strokeWidth={2.2} />
                      )}
                      {verification[key]}
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
            className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-well text-ink-3">
              <Check size={18} />
            </span>
            <p className="t-footnote max-w-56 text-ink-2">
              Submit an image and its verdict appears here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
