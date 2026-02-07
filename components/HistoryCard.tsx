import GlassCard from "./GlassCard";
import HistoryItem from "./HistoryItem";
import type { HistoryEntry } from "../lib/types";

type HistoryCardProps = {
  history: HistoryEntry[];
  onClear: () => void;
};

export default function HistoryCard({ history, onClear }: HistoryCardProps) {
  return (
    <GlassCard
      title="Verification History"
      subtitle="Previous submissions"
      className="lg:col-span-3"
      actions={
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-rose-400 bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear history
        </button>
      }
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
            No verifications yet. Upload an image to start building history.
          </div>
        ) : (
          history.map((entry) => <HistoryItem key={entry.id} entry={entry} />)
        )}
      </div>
    </GlassCard>
  );
}
