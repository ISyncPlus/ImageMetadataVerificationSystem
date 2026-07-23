import GlassCard from "./GlassCard";
import HistoryItem from "./HistoryItem";
import type { HistoryEntry } from "../lib/types";

type HistoryCardProps = {
  history: HistoryEntry[];
  onClear?: () => void;
  onEntryReport: (entry: HistoryEntry) => void;
  onSummaryReport: () => void;
};

export default function HistoryCard({
  history,
  onClear,
  onEntryReport,
  onSummaryReport,
}: HistoryCardProps) {
  return (
    <GlassCard
      title="Verification History"
      subtitle="Previous submissions"
      className="lg:col-span-3"
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSummaryReport}
            disabled={history.length === 0}
            className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Summary report
          </button>
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              disabled={history.length === 0}
              className="rounded-full border border-rose-400/40 bg-rose-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear history
            </button>
          ) : null}
        </div>
      }
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
            No verifications yet. Upload an image to start building history.
          </div>
        ) : (
          history.map((entry) => (
            <HistoryItem
              key={entry.id}
              entry={entry}
              onReport={() => onEntryReport(entry)}
            />
          ))
        )}
      </div>
    </GlassCard>
  );
}
