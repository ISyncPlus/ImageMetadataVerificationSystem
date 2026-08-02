import Card from "./ui/Card";
import HistoryList from "./HistoryList";
import { Button } from "./ui/Button";
import { Doc } from "./ui/icons";
import type { HistoryEntry } from "../lib/types";

type HistoryCardProps = {
  history: HistoryEntry[];
  onEntryReport: (entry: HistoryEntry) => void;
  onSummaryReport: () => void;
};

export default function HistoryCard({
  history,
  onEntryReport,
  onSummaryReport,
}: HistoryCardProps) {
  return (
    <Card
      title="Your submissions"
      subtitle={
        history.length === 1
          ? "1 image checked on this device"
          : `${history.length} images checked on this device`
      }
      actions={
        <Button size="sm" onClick={onSummaryReport} disabled={history.length === 0}>
          <Doc size={15} />
          Summary report
        </Button>
      }
    >
      <HistoryList
        entries={history}
        onEntryReport={onEntryReport}
        emptyMessage="Nothing submitted yet. Verify an image and it will be listed here."
      />
    </Card>
  );
}
