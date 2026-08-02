"use client";

import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { Pressable } from "./ui/Button";
import { ChevronRight } from "./ui/icons";
import { formatDateTime } from "../lib/format";
import type { HistoryEntry } from "../lib/types";

type HistoryItemProps = {
  entry: HistoryEntry;
  showSubmitter?: boolean;
  onOpen: () => void;
};

/** A row states only what distinguishes it; the full record lives one tap away
 *  so the list stays scannable. */
export default function HistoryItem({
  entry,
  showSubmitter = false,
  onOpen,
}: HistoryItemProps) {
  const checkedAt = formatDateTime(entry.checkedAt);
  const meta =
    showSubmitter && entry.submittedBy
      ? `${entry.submittedBy.name} · ${entry.submittedBy.identifier} · ${checkedAt}`
      : checkedAt;

  return (
    <Pressable
      onClick={onOpen}
      aria-label={`Open verification details for ${entry.fileName}`}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-2.5 pr-3 shadow-card transition-colors duration-150 hover:border-line-strong"
    >
      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-well">
        {entry.previewUrl ? (
          <Image
            src={entry.previewUrl}
            alt=""
            width={44}
            height={44}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="t-footnote block truncate font-semibold text-ink">
          {entry.fileName}
        </span>
        <span className="t-caption block truncate text-ink-2">{meta}</span>
      </span>

      <StatusBadge status={entry.status} />
      <ChevronRight size={16} className="shrink-0 text-ink-3" />
    </Pressable>
  );
}
