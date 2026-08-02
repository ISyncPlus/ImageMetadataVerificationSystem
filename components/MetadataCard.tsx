import Card from "./ui/Card";
import { Alert, Camera, Clock, Pin } from "./ui/icons";
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

/** A missing value is stated plainly and quietly — absent metadata is a finding,
 *  not an error, and it shouldn't shout louder than a real one. */
function Row({ icon: Glyph, label, value, detail }: RowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Glyph size={16} className="mt-0.5 shrink-0 text-ink-3" />
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <dt className="t-footnote text-ink-2">{label}</dt>
        <dd className="min-w-0 text-right">
          <span
            className={`t-footnote block wrap-break-word ${
              value ? "font-medium text-ink" : "text-ink-3"
            }`}
          >
            {value ?? "Not available"}
          </span>
          {detail ? (
            <span className="t-caption tabular block text-ink-3">{detail}</span>
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
      title="Extracted metadata"
      subtitle="What the file records about its own capture"
    >
      <dl className="flex flex-col divide-y divide-line">
        <Row icon={Clock} label="Capture time" value={metadata?.captureTime ?? null} />
        <Row
          icon={Pin}
          label="Location"
          value={metadata?.locationName ?? (coordinates ? "Coordinates only" : null)}
          detail={coordinates}
        />
        <Row icon={Camera} label="Device" value={metadata?.device ?? null} />
        <Row
          icon={Alert}
          label="Completeness"
          value={metadata?.completeness ?? null}
        />
      </dl>

      {metadata && !coordinates ? (
        <p className="t-caption mt-4 rounded-xl bg-warn-wash px-3.5 py-3 text-warn">
          {metadata.gpsTagsPresent
            ? "GPS tags are present but hold no usable values — the file is most likely a transcoded copy. Upload the original from DCIM/Camera."
            : "No GPS metadata in this file. Send the original photo rather than a compressed or forwarded copy."}
        </p>
      ) : null}
    </Card>
  );
}
