import Image from "next/image";
import StatusBadge from "./StatusBadge";
import type { HistoryEntry } from "../lib/types";

export default function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const checkedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(entry.checkedAt));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:items-center sm:text-left">
        <Image
          src={entry.previewUrl}
          alt={entry.fileName}
          width={64}
          height={64}
          unoptimized
          className="h-full w-full rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{entry.fileName}</p>
          <p className="text-xs text-white/60">Checked {checkedAt}</p>
        </div>
        <div className="flex w-full justify-center sm:ml-auto sm:w-auto">
          <StatusBadge status={entry.status} />
        </div>
      </div>
      <div className="flex flex-col gap-3 text-center text-xs text-white/70 sm:grid sm:grid-cols-3 sm:items-start sm:text-left">
        <div className="flex items-start justify-center gap-6 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:justify-start">
          <div>
            <p className="text-white/40">Capture Time</p>
            <p>{entry.metadata.captureTime ?? "Not Available"}</p>
          </div>
          <div>
            <p className="text-white/40">Location</p>
            <p>
              {entry.metadata.gps.latitude != null &&
              entry.metadata.gps.longitude != null
                ? `${entry.metadata.gps.latitude.toFixed(5)}, ${entry.metadata.gps.longitude.toFixed(5)}`
                : "Not Available"}
            </p>
          </div>
        </div>
        <div className="sm:col-span-1">
          <p className="text-white/40">Device</p>
          <p>{entry.metadata.device ?? "Not Available"}</p>
        </div>
      </div>
    </div>
  );
}
