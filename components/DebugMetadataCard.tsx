import GlassCard from "./GlassCard";
import type { DebugMetadata } from "../lib/metadata";

type DebugMetadataCardProps = {
  debugInfo: DebugMetadata | null;
};

export default function DebugMetadataCard({ debugInfo }: DebugMetadataCardProps) {
  return (
    <GlassCard title="Debug Metadata" subtitle="Raw GPS fields">
      {debugInfo ? (
        <pre className="max-h-72 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-[11px] text-white/70">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      ) : (
        <div className="text-sm text-white/60">
          Upload an image to inspect raw metadata.
        </div>
      )}
    </GlassCard>
  );
}
