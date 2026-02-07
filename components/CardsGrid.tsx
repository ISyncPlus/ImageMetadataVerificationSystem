import type { ChangeEvent } from "react";
import type { DebugMetadata } from "../lib/metadata";
import type { HistoryEntry, MetadataResult, VerificationResult } from "../lib/types";
import HistoryCard from "./HistoryCard";
import MetadataCard from "./MetadataCard";
import UploadCard from "./UploadCard";
import VerificationCard from "./VerificationCard";

type CardsGridProps = {
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  fileName: string | null;
  hash: string | null;
  metadata: MetadataResult | null;
  verification: VerificationResult | null;
  history: HistoryEntry[];
  debugInfo: DebugMetadata | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
  formatCoordinate: (value: number | null) => string;
};

export default function CardsGrid({
  isProcessing,
  error,
  previewUrl,
  fileName,
  hash,
  metadata,
  verification,
  history,
  debugInfo,
  onFileChange,
  onClearHistory,
  formatCoordinate,
}: CardsGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <UploadCard
        isProcessing={isProcessing}
        error={error}
        previewUrl={previewUrl}
        fileName={fileName}
        hash={hash}
        onFileChange={onFileChange}
      />
      <MetadataCard
        metadata={metadata}
        debugInfo={debugInfo}
        formatCoordinate={formatCoordinate}
      />
      <VerificationCard verification={verification} />
      <HistoryCard history={history} onClear={onClearHistory} />
    </div>
  );
}
