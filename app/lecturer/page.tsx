"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import DashboardHeader from "../../components/DashboardHeader";
import HistoryList from "../../components/HistoryList";
import HistoryDetail from "../../components/HistoryDetail";
import StatusBadge from "../../components/StatusBadge";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Sheet from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import {
  Alert,
  Camera,
  Check,
  Clock,
  Doc,
  Hash,
  Pin,
  Search,
} from "../../components/ui/icons";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import { clearHistory } from "../../lib/storage";
import { useHistory } from "../../lib/useHistory";
import { useRequireSession } from "../../lib/useSession";
import { formatCoordinates, formatDateTime } from "../../lib/format";
import type { HistoryEntry, VerificationStatus } from "../../lib/types";

type StatusFilter = "All" | VerificationStatus;
type ViewMode = "table" | "cards";

const FILTERS: readonly StatusFilter[] = [
  "All",
  "Verified",
  "Suspicious",
  "Reused",
];

const VIEW_MODES: readonly ViewMode[] = ["table", "cards"];

export default function LecturerDashboard() {
  const session = useRequireSession("lecturer");
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const stats = useMemo(() => {
    const verified = history.filter((entry) => entry.status === "Verified").length;
    const suspicious = history.filter(
      (entry) => entry.status === "Suspicious"
    ).length;
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
        (entry.submittedBy?.identifier.toLowerCase().includes(lowered) ?? false) ||
        entry.hash.toLowerCase().includes(lowered)
      );
    });
  }, [history, query, filter]);

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
    <PageShell session={session}>
      <DashboardHeader
        stats={stats}
        eyebrow="Departmental Reviewer"
        title="Coursework Audit Ledger"
        subtitle="Review student submission telemetry, inspect consistency checks, flag duplicate hashes, and generate formal grading reports."
      />

      <Card
        title="Departmental Submissions"
        subtitle={
          filtered.length === history.length
            ? `${history.length} records on device`
            : `${filtered.length} of ${history.length} records match filter`
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleSummaryReport}
              disabled={filtered.length === 0}
            >
              <Doc size={15} />
              Print Summary PDF
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setConfirmingClear(true)}
              disabled={history.length === 0}
            >
              Clear Ledger
            </Button>
          </div>
        }
        bodyClassName="flex flex-col gap-4"
      >
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student name, registration number, file, or hash…"
              aria-label="Search submissions"
              className="t-footnote min-h-10 w-full rounded-xl border border-line bg-well py-2 pl-9 pr-4 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <SegmentedControl
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              label="Filter by status"
            />

            <div className="hidden sm:block">
              <SegmentedControl
                options={VIEW_MODES}
                value={viewMode}
                onChange={setViewMode}
                label="View layout"
                render={(mode) => (
                  <span className="capitalize">{mode}</span>
                )}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Ledger: Table View or Cards View */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-well text-ink-3">
              <Doc size={18} />
            </span>
            <p className="t-footnote max-w-sm text-ink-2">
              {history.length === 0
                ? "No student submissions recorded yet. Verification records will appear here as students submit coursework photos."
                : "No submissions matched your search query or filter criteria."}
            </p>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left border-collapse text-ink">
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">Student</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">File</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">Capture Time</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">Location</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">Device</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2">Status</th>
                  <th className="py-3 px-3.5 t-caption font-semibold text-ink-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {filtered.map((entry) => {
                  const coords = formatCoordinates(entry.metadata.gps);
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="cursor-pointer transition-colors duration-100 hover:bg-surface-2/80"
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-well font-semibold text-accent t-caption">
                            {entry.submittedBy?.name?.[0]?.toUpperCase() ?? "S"}
                          </span>
                          <div>
                            <p className="t-footnote font-semibold text-ink">
                              {entry.submittedBy?.name ?? "Anonymous"}
                            </p>
                            <p className="t-caption font-mono text-ink-3">
                              {entry.submittedBy?.identifier ?? "No ID"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 max-w-[180px]">
                        <p className="t-footnote truncate font-medium text-ink">
                          {entry.fileName}
                        </p>
                        <p className="t-caption font-mono text-ink-3 truncate">
                          {entry.hash.slice(0, 12)}…
                        </p>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <p className="t-footnote text-ink">
                          {entry.metadata.captureTime ?? "Unavailable"}
                        </p>
                        <p className="t-caption text-ink-3">
                          {formatDateTime(entry.checkedAt)}
                        </p>
                      </td>

                      <td className="py-3 px-3.5 max-w-[180px]">
                        <p className="t-footnote truncate text-ink">
                          {entry.metadata.locationName ?? (coords ? "GPS Available" : "None")}
                        </p>
                        {coords ? (
                          <p className="t-caption font-mono text-ink-3 truncate">
                            {coords}
                          </p>
                        ) : null}
                      </td>

                      <td className="py-3 px-3.5 max-w-[150px]">
                        <p className="t-footnote truncate text-ink">
                          {entry.metadata.device ?? "None recorded"}
                        </p>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <StatusBadge status={entry.status} />
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                          }}
                          className="t-caption font-semibold text-accent hover:underline px-2 py-1 rounded-md"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <HistoryList
            entries={filtered}
            showSubmitter
            onEntryReport={handleEntryReport}
            emptyMessage="Nothing matches that filter."
          />
        )}
      </Card>

      {/* Slide-over Inspection Sheet */}
      <Sheet
        open={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.fileName ?? "Submission Details"}
        subtitle={
          selectedEntry?.submittedBy
            ? `${selectedEntry.submittedBy.name} · ${selectedEntry.submittedBy.identifier}`
            : undefined
        }
      >
        {selectedEntry ? (
          <HistoryDetail
            entry={selectedEntry}
            onReport={() => handleEntryReport(selectedEntry)}
          />
        ) : null}
      </Sheet>

      {/* Clear Confirmation Sheet */}
      <Sheet
        open={confirmingClear}
        onClose={() => setConfirmingClear(false)}
        title="Clear verification records?"
        subtitle={`${history.length} stored ${
          history.length === 1 ? "record" : "records"
        }`}
      >
        <div className="flex flex-col gap-5">
          <p className="t-callout text-ink-2">
            This action will remove all {history.length} verification records from
            this local browser session. Stored cryptographic hashes used for duplicate
            detection will also be cleared.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              variant="danger"
              className="sm:flex-1"
              onClick={() => {
                clearHistory();
                setConfirmingClear(false);
              }}
            >
              Clear all records
            </Button>
            <Button className="sm:flex-1" onClick={() => setConfirmingClear(false)}>
              Keep records
            </Button>
          </div>
        </div>
      </Sheet>
    </PageShell>
  );
}
