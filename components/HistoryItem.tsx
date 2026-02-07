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
      <div className="flex items-center gap-4">
        <Image
          src={entry.previewUrl}
          alt={entry.fileName}
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{entry.fileName}</p>
          <p className="text-xs text-white/60">Checked {checkedAt}</p>
        </div>
        <StatusBadge status={entry.status} />
      </div>
      <div className="grid gap-2 text-xs text-white/70 md:grid-cols-3">
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
        <div>
          <p className="text-white/40">Device</p>
          <p>{entry.metadata.device ?? "Not Available"}</p>
        </div>
      </div>
    </div>
  );
}
