import Image from "next/image";
import StatusBadge from "./StatusBadge";
import type { HistoryEntry } from "../lib/types";

type HistoryItemProps = {
  entry: HistoryEntry;
  onReport: () => void;
  showSubmitter?: boolean;
};

export default function HistoryItem({
  entry,
  onReport,
  showSubmitter = false,
}: HistoryItemProps) {
  const checkedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(entry.checkedAt));

  const coordinates =
    entry.metadata.gps.latitude != null &&
    entry.metadata.gps.longitude != null &&
    Number.isFinite(entry.metadata.gps.latitude) &&
    Number.isFinite(entry.metadata.gps.longitude)
      ? `${entry.metadata.gps.latitude.toFixed(5)}, ${entry.metadata.gps.longitude.toFixed(5)}`
      : null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:items-center sm:text-left">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          {entry.previewUrl ? (
            <Image
              src={entry.previewUrl}
              alt={entry.fileName}
              width={64}
              height={64}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
              No preview
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {entry.fileName}
          </p>
          <p className="text-xs text-white/60">
            {showSubmitter && entry.submittedBy
              ? `${entry.submittedBy.name} (${entry.submittedBy.identifier}) · Checked ${checkedAt}`
              : `Checked ${checkedAt}`}
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-3 sm:ml-auto sm:w-auto">
          <StatusBadge status={entry.status} />
          <button
            type="button"
            onClick={onReport}
            className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Report
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-center text-xs text-white/70 sm:grid sm:grid-cols-3 sm:items-start sm:text-left">
        <div>
          <p className="text-white/40">Capture Time</p>
          <p>{entry.metadata.captureTime ?? "Not Available"}</p>
        </div>
        <div>
          <p className="text-white/40">Location</p>
          <p>
            {entry.metadata.locationName ? (
              <>
                <span className="block">{entry.metadata.locationName}</span>
                <span className="block text-white/50">
                  {coordinates ?? "Coordinates unavailable"}
                </span>
              </>
            ) : (
              coordinates ?? "Not Available"
            )}
          </p>
        </div>
        <div className="sm:col-span-1">
          <p className="text-white/40">Device</p>
          <p>{entry.metadata.device ?? "Not Available"}</p>
        </div>
      </div>
    </div>
  );
}
