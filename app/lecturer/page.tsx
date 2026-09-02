"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import DashboardHeader from "../../components/DashboardHeader";
import HistoryDetail from "../../components/HistoryDetail";
import HistoryList from "../../components/HistoryList";
import PageShell from "../../components/PageShell";
import StatusBadge from "../../components/StatusBadge";
import Card from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Sheet from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import { Alert, Doc, Search } from "../../components/ui/icons";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import { ApiError, deleteSubmission } from "../../lib/api";
import { useRequireProfile } from "../../lib/useProfile";
import { useDebounced, useSubmissions } from "../../lib/useSubmissions";
import { formatCoordinates, formatDateTime } from "../../lib/format";
import { fade, springMove, stagger } from "../../lib/motion";
import type { HistoryEntry, VerificationStatus } from "../../lib/types";

type StatusFilter = "All" | VerificationStatus;
type ViewMode = "table" | "cards";

const FILTERS: readonly StatusFilter[] = ["All", "Verified", "Suspicious", "Reused"];
const VIEW_MODES: readonly ViewMode[] = ["table", "cards"];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "S";

export default function LecturerDashboard() {
  const reduced = useReducedMotion();
  const { profile, loading: profileLoading } = useRequireProfile("lecturer");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HistoryEntry | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search hits the database, so it waits for a pause in typing.
  const debouncedQuery = useDebounced(query, 300);

  const { submissions, stats, initialLoading, loading, error, remove } =
    useSubmissions({
      take: 100,
      ...(filter === "All" ? {} : { status: filter }),
      ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
    });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteSubmission(target.id);
      remove(target.id);
      if (selected?.id === target.id) setSelected(null);
    } catch (caught) {
      setActionError(
        caught instanceof ApiError ? caught.message : "Could not remove that record."
      );
    }
  };

  if (profileLoading || !profile) {
    return (
      <PageShell>
        <div className="flex flex-col gap-4 pt-4">
          <div className="shimmer h-8 w-72 rounded-lg bg-well" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="shimmer h-24 rounded-xl bg-well" />
            ))}
          </div>
          <div className="shimmer h-96 rounded-2xl bg-well" />
        </div>
      </PageShell>
    );
  }

  const isFiltered = filter !== "All" || debouncedQuery.trim().length > 0;

  return (
    <PageShell session={profile}>
      <div className="py-2">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Lecturer Ledger" },
          ]}
        />
      </div>

      <DashboardHeader
        stats={stats}
        eyebrow="Departmental reviewer"
        title="Coursework audit ledger"
        subtitle={`Every submission filed by the department${
          stats.students > 0
            ? ` — ${stats.students} ${stats.students === 1 ? "student" : "students"} so far`
            : ""
        }. Duplicate detection runs across all students, not just each student's own history.`}
      />

      <Reveal index={2}>
        <Card
          title="Submissions"
          subtitle={
            isFiltered
              ? `${submissions.length} matching of ${stats.total}`
              : `${stats.total} ${stats.total === 1 ? "record" : "records"}`
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  openPrintableReport(buildSummaryReportHtml(submissions))
                }
                disabled={submissions.length === 0}
              >
                <Doc size={14} />
                Print summary
              </Button>
            </div>
          }
          bodyClassName="flex flex-col gap-4"
        >
          {/* Toolbar */}
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
                placeholder="Search student, registration number, file or hash…"
                aria-label="Search submissions"
                className="t-footnote min-h-10 w-full rounded-xl border border-line bg-well py-2 pl-9 pr-9 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent"
              />
              {/* Only appears while a query is genuinely in flight. */}
              <AnimatePresence>
                {loading && !initialLoading ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                    className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-line border-t-accent"
                  />
                ) : null}
              </AnimatePresence>
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
                  render={(mode) => <span className="capitalize">{mode}</span>}
                />
              </div>
            </div>
          </div>

          {(error || actionError) ? (
            <p className="t-footnote flex items-start gap-2 rounded-xl border border-bad/30 bg-bad-wash px-3.5 py-2.5 text-bad">
              <Alert size={14} className="mt-0.5 shrink-0" />
              {error ?? actionError}
            </p>
          ) : null}

          {initialLoading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="shimmer h-16 rounded-xl bg-well" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-14 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-well text-ink-3">
                <Doc size={18} />
              </span>
              <p className="t-footnote max-w-sm text-ink-2">
                {stats.total === 0
                  ? "No submissions yet. Records appear here as students check their coursework photos."
                  : "Nothing matches that search or filter."}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Student", "File", "Captured", "Location", "Device", "Status", ""].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="t-caption whitespace-nowrap px-3 py-2.5 font-semibold text-ink-2"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false} mode="popLayout">
                    {submissions.map((entry, index) => {
                      const coords = formatCoordinates(entry.metadata.gps);
                      return (
                        <motion.tr
                          key={entry.id}
                          layout={!reduced}
                          initial={
                            reduced ? { opacity: 0 } : { opacity: 0, y: 6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                          transition={{
                            ...springMove,
                            delay: stagger(Math.min(index, 8), 0.02, 0.16),
                          }}
                          onClick={() => setSelected(entry)}
                          className="cursor-pointer border-b border-line transition-colors duration-100 last:border-0 hover:bg-well"
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="t-caption flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-wash font-semibold text-accent">
                                {initials(entry.submittedBy?.name ?? "")}
                              </span>
                              <span className="min-w-0">
                                <span className="t-footnote block truncate font-medium text-ink">
                                  {entry.submittedBy?.name ?? "Unknown"}
                                </span>
                                <span className="t-caption block truncate font-mono text-ink-3">
                                  {entry.submittedBy?.identifier || "—"}
                                </span>
                              </span>
                            </div>
                          </td>

                          <td className="max-w-[11rem] px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-line bg-well">
                                {entry.previewUrl ? (
                                  <Image
                                    src={entry.previewUrl}
                                    alt=""
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                ) : null}
                              </span>
                              <span className="min-w-0">
                                <span className="t-footnote block truncate text-ink">
                                  {entry.fileName}
                                </span>
                                <span className="t-caption block truncate font-mono text-ink-3">
                                  {entry.hash.slice(0, 10)}…
                                </span>
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3">
                            <span className="t-footnote block text-ink">
                              {entry.metadata.captureTime ?? "—"}
                            </span>
                            <span className="t-caption block text-ink-3">
                              filed {formatDateTime(entry.checkedAt)}
                            </span>
                          </td>

                          <td className="max-w-[12rem] px-3 py-3">
                            <span className="t-footnote block truncate text-ink">
                              {entry.metadata.locationName ??
                                (coords ? "Coordinates only" : "—")}
                            </span>
                            {coords ? (
                              <span className="t-caption block truncate font-mono text-ink-3">
                                {coords}
                              </span>
                            ) : null}
                          </td>

                          <td className="max-w-[9rem] px-3 py-3">
                            <span className="t-footnote block truncate text-ink">
                              {entry.metadata.device ?? "—"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3">
                            <StatusBadge status={entry.status} size="sm" />
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-right">
                            <span className="t-caption font-semibold text-accent">
                              Inspect
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <HistoryList
              entries={submissions}
              showSubmitter
              onEntryReport={(entry) =>
                openPrintableReport(buildEntryReportHtml(entry))
              }
              emptyMessage="Nothing matches that filter."
            />
          )}
        </Card>
      </Reveal>

      {/* Inspection */}
      <Sheet
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.fileName ?? "Submission"}
        subtitle={
          selected?.submittedBy
            ? `${selected.submittedBy.name} · ${selected.submittedBy.identifier}`
            : undefined
        }
      >
        {selected ? (
          <div className="flex flex-col gap-5">
            <HistoryDetail
              entry={selected}
              onReport={() =>
                openPrintableReport(buildEntryReportHtml(selected))
              }
            />
            <Button
              variant="danger"
              onClick={() => setPendingDelete(selected)}
              className="w-full"
            >
              Remove from ledger
            </Button>
          </div>
        ) : null}
      </Sheet>

      {/* Destructive actions are confirmed; nothing else is. */}
      <Sheet
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Remove this record?"
        subtitle={pendingDelete?.fileName}
      >
        <div className="flex flex-col gap-5">
          <p className="t-callout text-ink-2">
            This permanently deletes the verification record for{" "}
            <span className="font-medium text-ink">
              {pendingDelete?.submittedBy?.name ?? "this student"}
            </span>
            . Its hash will no longer be matched by duplicate detection, so the
            same file could later be submitted as new.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              variant="danger"
              className="sm:flex-1"
              onClick={() => void confirmDelete()}
            >
              Remove record
            </Button>
            <Button className="sm:flex-1" onClick={() => setPendingDelete(null)}>
              Keep it
            </Button>
          </div>
        </div>
      </Sheet>
    </PageShell>
  );
}
