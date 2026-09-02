"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import HistoryDetail from "./HistoryDetail";
import HistoryItem from "./HistoryItem";
import Sheet from "./ui/Sheet";
import { Doc } from "./ui/icons";
import { springMove } from "../lib/motion";
import type { HistoryEntry } from "../lib/types";

type HistoryListProps = {
  entries: HistoryEntry[];
  showSubmitter?: boolean;
  onEntryReport: (entry: HistoryEntry) => void;
  emptyMessage: string;
};

export default function HistoryList({
  entries,
  showSubmitter = false,
  onEntryReport,
  emptyMessage,
}: HistoryListProps) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [open, setOpen] = useState(false);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-line px-6 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-well text-ink-3 ring-1 ring-line">
          <Doc size={18} />
        </span>
        <p className="t-footnote max-w-xs text-pretty text-ink-2">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <ul className="ruled -mx-3 border-y border-rule">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            /* Filtering rearranges the list rather than redrawing it, so a row
               the eye was tracking stays the same row. */
            <motion.li
              key={entry.id}
              layout={reduced ? false : "position"}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={springMove}
            >
              <HistoryItem
                entry={entry}
                showSubmitter={showSubmitter}
                onOpen={() => {
                  setSelected(entry);
                  setOpen(true);
                }}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={selected?.fileName ?? "Submission"}
        subtitle={
          selected?.submittedBy
            ? `${selected.submittedBy.name} · ${selected.submittedBy.identifier}`
            : undefined
        }
      >
        {selected ? (
          <HistoryDetail
            entry={selected}
            onReport={() => onEntryReport(selected)}
          />
        ) : null}
      </Sheet>
    </>
  );
}
