"use client";

import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../../components/AppNavbar";
import DashboardHeader from "../../components/DashboardHeader";
import GlassCard from "../../components/GlassCard";
import HistoryItem from "../../components/HistoryItem";
import PageShell from "../../components/PageShell";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import { clearHistory, loadHistory } from "../../lib/storage";
import { useRequireSession } from "../../lib/useSession";
import type { HistoryEntry, VerificationStatus } from "../../lib/types";

type StatusFilter = "All" | VerificationStatus;

const FILTERS: StatusFilter[] = ["All", "Verified", "Suspicious", "Reused"];

export default function LecturerDashboard() {
  const session = useRequireSession("lecturer");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const stats = useMemo(() => {
    const verified = history.filter((entry) => entry.status === "Verified").length;
    const suspicious = history.filter((entry) => entry.status === "Suspicious").length;
    const reused = history.filter((entry) => entry.status === "Reused").length;
    return {
      total: history.length,
      verified,
      suspicious,
      reused,
    };
  }, [history]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return history.filter((entry) => {
      if (filter !== "All" && entry.status !== filter) {
        return false;
      }
      if (!lowered) {
        return true;
      }
      return (
        entry.fileName.toLowerCase().includes(lowered) ||
        (entry.submittedBy?.name.toLowerCase().includes(lowered) ?? false) ||
        (entry.submittedBy?.identifier.toLowerCase().includes(lowered) ?? false)
      );
    });
  }, [history, query, filter]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleEntryReport = (entry: HistoryEntry) => {
    openPrintableReport(buildEntryReportHtml(entry));
  };

  const handleSummaryReport = () => {
    if (filtered.length > 0) {
      openPrintableReport(buildSummaryReportHtml(filtered));
    }
  };

  if (!session) {
    return null;
  }

  return (
    <PageShell>
      <AppNavbar session={session} />
      <DashboardHeader
        stats={stats}
        eyebrow="Lecturer Review Dashboard"
        subtitle="Review student submissions, inspect flagged metadata, and generate verification reports."
      />

      <GlassCard
        title="Submission Review"
        subtitle="All student verification records"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSummaryReport}
              disabled={filtered.length === 0}
              className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Summary report
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="rounded-full border border-rose-400/40 bg-rose-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear records
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by student name, reg. number, or file…"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400/60 sm:max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    filter === option
                      ? "border-cyan-400/50 bg-cyan-400/20 text-cyan-100"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
                {history.length === 0
                  ? "No submissions yet. Records appear here after students verify images."
                  : "No submissions match the current search or filter."}
              </div>
            ) : (
              filtered.map((entry) => (
                <HistoryItem
                  key={entry.id}
                  entry={entry}
                  showSubmitter
                  onReport={() => handleEntryReport(entry)}
                />
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </PageShell>
  );
}
