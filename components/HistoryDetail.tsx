import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { Button } from "./ui/Button";
import { Alert, Camera, Check, Clock, Copies, Doc, Hash, Pin } from "./ui/icons";
import { formatCoordinates, formatDateTime } from "../lib/format";
import type { HistoryEntry } from "../lib/types";

type HistoryDetailProps = {
  entry: HistoryEntry;
  onReport: () => void;
};

const CHECKS: Array<{
  key: "timeCheck" | "locationCheck" | "deviceCheck" | "duplicateCheck";
  label: string;
}> = [
  { key: "timeCheck", label: "Capture time" },
  { key: "locationCheck", label: "Location" },
  { key: "deviceCheck", label: "Device" },
  { key: "duplicateCheck", label: "Not a duplicate" },
];

function Field({
  icon: Glyph,
  label,
  value,
  mono = false,
}: {
  icon: typeof Clock;
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Glyph size={16} className="mt-0.5 shrink-0 text-ink-3" />
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4">
        <span className="t-footnote text-ink-2">{label}</span>
        <span
          className={`t-footnote min-w-0 text-right wrap-break-word ${
            mono ? "font-mono text-ink-2" : ""
          } ${value ? "font-medium text-ink" : "text-ink-3"}`}
        >
          {value ?? "Not available"}
        </span>
      </div>
    </div>
  );
}

export default function HistoryDetail({ entry, onReport }: HistoryDetailProps) {
  const coordinates = formatCoordinates(entry.metadata.gps);

  return (
    <div className="flex flex-col gap-5">
      {entry.previewUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-well">
          <Image
            src={entry.previewUrl}
            alt={entry.fileName}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <StatusBadge status={entry.status} size="md" />
        <p className="t-callout text-ink-2">{entry.reason}</p>
      </div>

      <div>
        <h3 className="t-caption mb-2 font-semibold text-ink-2">Checks</h3>
        <ul className="grid grid-cols-2 gap-1.5">
          {CHECKS.map(({ key, label }) => {
            const passed = entry.verification?.[key] === "Pass";
            return (
              <li
                key={key}
                className="flex items-center gap-2 rounded-lg bg-well px-3 py-2"
              >
                <span className={passed ? "text-good" : "text-bad"}>
                  {passed ? (
                    <Check size={14} strokeWidth={2.4} />
                  ) : (
                    <Alert size={14} strokeWidth={2.2} />
                  )}
                </span>
                <span className="t-caption min-w-0 flex-1 truncate text-ink">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="t-caption mb-1 font-semibold text-ink-2">Record</h3>
        <div className="flex flex-col divide-y divide-line">
          <Field
            icon={Clock}
            label="Capture time"
            value={entry.metadata.captureTime}
          />
          <Field
            icon={Pin}
            label="Location"
            value={entry.metadata.locationName ?? coordinates}
          />
          {entry.metadata.locationName && coordinates ? (
            <Field icon={Pin} label="Coordinates" value={coordinates} />
          ) : null}
          <Field icon={Camera} label="Device" value={entry.metadata.device} />
          <Field
            icon={Copies}
            label="Submitted by"
            value={
              entry.submittedBy
                ? `${entry.submittedBy.name} (${entry.submittedBy.identifier})`
                : null
            }
          />
          <Field
            icon={Clock}
            label="Checked"
            value={formatDateTime(entry.checkedAt)}
          />
          <Field icon={Hash} label="SHA-256" value={entry.hash} mono />
        </div>
      </div>

      <Button variant="primary" onClick={onReport} className="w-full">
        <Doc size={16} />
        Open printable report
      </Button>
    </div>
  );
}
