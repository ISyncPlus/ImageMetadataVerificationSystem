import GlassCard from "./GlassCard";
import type { DebugMetadata } from "../lib/metadata";
import type { MetadataResult } from "../lib/types";

type MetadataCardProps = {
  metadata: MetadataResult | null;
  debugInfo: DebugMetadata | null;
  formatCoordinate: (value: number | null) => string;
};

export default function MetadataCard({
  metadata,
  debugInfo,
  formatCoordinate,
}: MetadataCardProps) {
  return (
    <GlassCard title="Metadata Display" subtitle="Capture time, location, device">
      <div className="space-y-4 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span className="text-white/50">Capture Time</span>
          <span className="text-white">
            {metadata?.captureTime ?? "Not Available"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50">Location Name</span>
          <span className="text-white">
            {metadata?.locationName ?? "Not Available"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50">Latitude</span>
          <span className="text-white">
            {formatCoordinate(metadata?.gps.latitude ?? null)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50">Longitude</span>
          <span className="text-white">
            {formatCoordinate(metadata?.gps.longitude ?? null)}
          </span>
        </div>
        {metadata &&
        (metadata.gps.latitude == null || metadata.gps.longitude == null) ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-[11px] text-amber-100">
            {debugInfo?.gpsFields?.GPSLatitude ||
            debugInfo?.gpsFields?.GPSLongitude
              ? "GPS tags are present but empty. The file is likely a transcoded copy (metadata stripped). Upload the original file from DCIM/Camera."
              : "No GPS metadata found in this file. Ensure you upload the original photo without compression."}
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Device Info</span>
          <span className="text-white">
            {metadata?.device ?? "Not Available"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50">Completeness</span>
          <span className="text-white">
            {metadata?.completeness ?? "Awaiting data"}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
