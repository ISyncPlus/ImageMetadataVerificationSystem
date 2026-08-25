import Card from "./ui/Card";
import { Alert, Camera, Clock, Pin, ShieldCheck } from "./ui/icons";
import { formatCoordinates } from "../lib/format";
import type { MetadataResult } from "../lib/types";

type MetadataCardProps = {
  metadata: MetadataResult | null;
};

type RowProps = {
  icon: typeof Clock;
  label: string;
  value: string | null;
  detail?: string | null;
};

function Row({ icon: Glyph, label, value, detail }: RowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-well text-ink-2">
        <Glyph size={15} />
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <dt className="t-footnote font-medium text-ink-2">{label}</dt>
        <dd className="min-w-0 text-right">
          <span
            className={`t-footnote block wrap-break-word ${
              value ? "font-semibold text-ink" : "text-ink-3 italic font-normal"
            }`}
          >
            {value ?? "Not available"}
          </span>
          {detail ? (
            <span className="t-caption font-mono tabular block text-ink-3 mt-0.5">
              {detail}
            </span>
          ) : null}
        </dd>
      </div>
    </div>
  );
}

export default function MetadataCard({ metadata }: MetadataCardProps) {
  const coordinates = metadata ? formatCoordinates(metadata.gps) : null;

  return (
    <Card
      title="Extracted Telemetry"
      subtitle="Raw EXIF metadata parsed from camera sensor"
    >
      <dl className="flex flex-col divide-y divide-line">
        <Row
          icon={Clock}
          label="Capture Timestamp"
          value={metadata?.captureTime ?? null}
        />
        <Row
          icon={Pin}
          label="Geographic Location"
          value={metadata?.locationName ?? (coordinates ? "Coordinates extracted" : null)}
          detail={coordinates}
        />
        <Row
          icon={Camera}
          label="Camera / Device"
          value={metadata?.device ?? null}
        />
        <Row
          icon={ShieldCheck}
          label="Metadata Completeness"
          value={metadata?.completeness ?? null}
        />
      </dl>

      {metadata && !coordinates ? (
        <div className="t-caption mt-4 flex items-start gap-2.5 rounded-xl bg-warn-wash p-3.5 text-warn border border-warn/20">
          <Alert size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Missing GPS Geotags</p>
            <p className="mt-0.5 text-ink-2">
              {metadata.gpsTagsPresent
                ? "GPS metadata tags are present but empty (common in edited images). Upload the original file from camera storage."
                : "No GPS coordinates recorded. Ensure location services are enabled on your camera device before shooting fieldwork."}
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
