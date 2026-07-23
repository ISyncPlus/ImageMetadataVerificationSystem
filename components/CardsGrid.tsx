import type { ChangeEvent } from "react";
import type { HistoryEntry } from "../lib/types";
import HistoryCard from "./HistoryCard";
import MetadataCard from "./MetadataCard";
import UploadCard from "./UploadCard";
import VerificationCard from "./VerificationCard";

type CardsGridProps = {
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  fileName: string | null;
  currentEntry: HistoryEntry | null;
  history: HistoryEntry[];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearHistory?: () => void;
  onEntryReport: (entry: HistoryEntry) => void;
  onSummaryReport: () => void;
  formatCoordinate: (value: number | null) => string;
};

export default function CardsGrid({
  isProcessing,
  error,
  previewUrl,
  fileName,
  currentEntry,
  history,
  onFileChange,
  onClearHistory,
  onEntryReport,
  onSummaryReport,
  formatCoordinate,
}: CardsGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <UploadCard
        isProcessing={isProcessing}
        error={error}
        previewUrl={previewUrl}
        fileName={fileName}
        hash={currentEntry?.hash ?? null}
        onFileChange={onFileChange}
      />
      <MetadataCard
        metadata={currentEntry?.metadata ?? null}
        formatCoordinate={formatCoordinate}
      />
      <VerificationCard
        verification={currentEntry?.verification ?? null}
        onDownloadReport={
          currentEntry ? () => onEntryReport(currentEntry) : undefined
        }
      />
      <HistoryCard
        history={history}
        onClear={onClearHistory}
        onEntryReport={onEntryReport}
        onSummaryReport={onSummaryReport}
      />
    </div>
  );
}
