import HistoryCard from "./HistoryCard";
import MetadataCard from "./MetadataCard";
import Reveal from "./ui/Reveal";
import UploadCard from "./UploadCard";
import VerificationCard from "./VerificationCard";
import type { HistoryEntry } from "../lib/types";

type CardsGridProps = {
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  fileName: string | null;
  currentEntry: HistoryEntry | null;
  history: HistoryEntry[];
  onFile: (file: File) => void;
  onEntryReport: (entry: HistoryEntry) => void;
  onSummaryReport: () => void;
};

export default function CardsGrid({
  isProcessing,
  error,
  previewUrl,
  fileName,
  currentEntry,
  history,
  onFile,
  onEntryReport,
  onSummaryReport,
}: CardsGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Reveal index={0} className="flex">
        <UploadCard
          isProcessing={isProcessing}
          error={error}
          previewUrl={previewUrl}
          fileName={fileName}
          hash={currentEntry?.hash ?? null}
          onFile={onFile}
        />
      </Reveal>
      <Reveal index={1} className="flex">
        <MetadataCard metadata={currentEntry?.metadata ?? null} />
      </Reveal>
      <Reveal index={2} className="flex">
        <VerificationCard
          verification={currentEntry?.verification ?? null}
          onDownloadReport={
            currentEntry ? () => onEntryReport(currentEntry) : undefined
          }
        />
      </Reveal>
      <Reveal index={3} className="lg:col-span-3">
        <HistoryCard
          history={history}
          onEntryReport={onEntryReport}
          onSummaryReport={onSummaryReport}
        />
      </Reveal>
    </div>
  );
}
