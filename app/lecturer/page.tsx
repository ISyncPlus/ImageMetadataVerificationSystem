"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import DashboardHeader from "../../components/DashboardHeader";
import HistoryDetail from "../../components/HistoryDetail";
import HistoryList from "../../components/HistoryList";
import PageShell from "../../components/PageShell";
import StatusBadge from "../../components/StatusBadge";
import Field from "../../components/ui/Field";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Sheet from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import { Alert, ArrowRight, Doc, Search } from "../../components/ui/icons";
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
import UserAvatar from "../../components/UserAvatar";
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
      <PageShell stamp="Lecturer Ledger">
        <Field pad="none" className="pt-12">
          <div className="flex flex-col gap-5">
            <div className="shimmer h-3 w-44 rounded-sm bg-well" />
            <div className="shimmer h-10 w-96 max-w-full rounded-sm bg-well" />
            <div className="ruled-x mt-6 grid grid-cols-2 border-y border-rule sm:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="px-5 py-7 first:pl-0">
                  <div className="shimmer h-2.5 w-20 rounded-sm bg-well" />
                  <div className="shimmer mt-4 h-8 w-14 rounded-sm bg-well" />
                </div>
              ))}
            </div>
            <div className="ruled mt-6 border-y border-rule">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="shimmer my-2 h-12 rounded-sm bg-well" />
              ))}
            </div>
          </div>
        </Field>
      </PageShell>
    );
  }

  const isFiltered = filter !== "All" || debouncedQuery.trim().length > 0;

  return (
    <PageShell session={profile} stamp="Lecturer Ledger · Departmental">
      <Field pad="none" className="pt-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Lecturer Ledger" }]}
        />
      </Field>

      <DashboardHeader
        stats={stats}
        eyebrow="Departmental reviewer"
        title="Coursework audit ledger"
        subtitle="Every submission filed by the department. Duplicate detection runs across all students, not merely within each student's own history."
        slip={
          <div className="w-full max-w-xs overflow-hidden rounded-lg border border-line bg-surface shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface-2/60 px-4 py-2.5">
              <span className="t-mark text-ink-3">Reviewer</span>
              <span className="t-mark text-accent-deep">Lecturer</span>
            </div>
            <div className="flex items-center gap-3 border-b border-rule px-4 py-3 bg-surface">
              <UserAvatar
                name={profile.name}
                image={profile.image}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <span className="t-footnote block truncate font-semibold text-ink">
                  {profile.name}
                </span>
                <span className="t-caption block truncate text-ink-3">
                  {profile.email}
                </span>
              </div>
            </div>
            <dl className="ruled px-4">
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="t-mark text-ink-3">Staff ID</dt>
                <dd className="t-num text-[0.8125rem] text-ink">
                  {profile.identifier || "-"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="t-mark text-ink-3">Students filed</dt>
                <dd className="t-num text-[0.8125rem] text-ink">
                  {String(stats?.students ?? 0).padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      {/* The ledger runs wider than the reading column. Prose has a comfortable
          measure; a table of evidence does not — it wants every pixel the
          screen will give it. */}
      <Field bleed pad="md">
        <div className="mx-auto w-full max-w-[104rem] px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="t-mark text-accent-deep">File 03 · Submissions</p>
              <h2 className="t-title-1 mt-2 text-ink">
                {isFiltered
                  ? `${submissions.length} matching of ${stats?.total ?? 0}`
                  : `${stats?.total ?? 0} ${(stats?.total ?? 0) === 1 ? "record" : "records"}`}
              </h2>
            </div>

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

          {/* Toolbar */}
          <div className="mt-7 flex flex-col gap-3 border-y border-rule py-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search student, registration number, file or hash"
                aria-label="Search submissions"
                className="t-footnote min-h-10 w-full rounded-md border border-line bg-well py-2 pl-9 pr-9 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent focus:bg-surface"
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

          {error || actionError ? (
            <p className="t-footnote mt-4 flex items-start gap-2 rounded-sm border-l-2 border-bad bg-bad-wash px-3.5 py-2.5 text-bad">
              <Alert size={14} className="mt-0.5 shrink-0" />
              {error ?? actionError}
            </p>
          ) : null}

          {initialLoading ? (
            <div className="ruled mt-2 border-b border-rule">
              {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center gap-4 py-4">
                  <div className="shimmer h-8 w-8 shrink-0 rounded-full bg-well" />
                  <div className="shimmer h-9 w-9 shrink-0 rounded-sm bg-well" />
                  <div className="shimmer h-3 flex-1 rounded-sm bg-well" />
                  <div className="shimmer h-5 w-20 shrink-0 rounded-sm bg-well" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="mt-2 flex flex-col items-center gap-3 border-y border-dashed border-line px-6 py-20 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-well text-ink-3 ring-1 ring-line">
                <Doc size={18} />
              </span>
              <p className="t-footnote max-w-sm text-pretty text-ink-2">
                {stats.total === 0
                  ? "No submissions yet. Records appear here as students check their coursework photographs."
                  : "Nothing matches that search or filter."}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="-mx-5 overflow-x-auto px-5 lg:-mx-8 lg:px-8">
              <table className="w-full min-w-[68rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line-strong">
                    {[
                      "Student",
                      "File",
                      "Captured",
                      "Location",
                      "Device",
                      "Status",
                      "",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="t-mark whitespace-nowrap px-3 py-3 text-ink-3 first:pl-0"
                      >
                        {heading}
                      </th>
                    ))}
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
                          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
                          }
                          transition={{
                            ...springMove,
                            delay: stagger(Math.min(index, 8), 0.02, 0.16),
                          }}
                          onClick={() => setSelected(entry)}
                          className="group relative cursor-pointer border-b border-rule transition-colors duration-150 last:border-0 hover:bg-well"
                        >
                          <td className="relative py-3.5 pl-0 pr-3">
                            {/* The row marker sits in the table's own left
                                margin, so scanning down the ledger reads as
                                moving a ruler down a page. */}
                            <span
                              aria-hidden
                              className="absolute inset-y-0 -left-2 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                            />
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-wash ring-1 ring-accent-edge">
                                <span className="t-mark text-[0.5625rem] text-accent-deep">
                                  {initials(entry.submittedBy?.name ?? "")}
                                </span>
                              </span>
                              <span className="min-w-0">
                                <span className="t-footnote block truncate font-medium text-ink">
                                  {entry.submittedBy?.name ?? "Unknown"}
                                </span>
                                <span className="t-num block truncate text-[0.6875rem] text-ink-3">
                                  {entry.submittedBy?.identifier || "—"}
                                </span>
                              </span>
                            </div>
                          </td>

                          <td className="max-w-[13rem] px-3 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-well ring-1 ring-line">
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
                                <span className="t-num block truncate text-[0.6875rem] text-ink-3">
                                  {entry.hash.slice(0, 12)}…
                                </span>
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3.5">
                            <span className="t-num block text-[0.75rem] text-ink">
                              {entry.metadata.captureTime ?? "—"}
                            </span>
                            <span className="t-caption block text-ink-3">
                              filed {formatDateTime(entry.checkedAt)}
                            </span>
                          </td>

                          <td className="max-w-[14rem] px-3 py-3.5">
                            <span className="t-footnote block truncate text-ink">
                              {entry.metadata.locationName ??
                                (coords ? "Coordinates only" : "—")}
                            </span>
                            {coords ? (
                              <span className="t-num block truncate text-[0.6875rem] text-ink-3">
                                {coords}
                              </span>
                            ) : null}
                          </td>

                          <td className="max-w-[10rem] px-3 py-3.5">
                            <span className="t-footnote block truncate text-ink-2">
                              {entry.metadata.device ?? "—"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-3 py-3.5">
                            <StatusBadge status={entry.status} dot />
                          </td>

                          <td className="whitespace-nowrap px-3 py-3.5 text-right">
                            <span className="t-mark inline-flex items-center gap-1 text-ink-3 transition-colors group-hover:text-accent-deep">
                              Inspect
                              <ArrowRight
                                size={12}
                                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
                              />
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
            <div className="mt-2 px-3">
              <HistoryList
                entries={submissions}
                showSubmitter
                onEntryReport={(entry) =>
                  openPrintableReport(buildEntryReportHtml(entry))
                }
                emptyMessage="Nothing matches that filter."
              />
            </div>
          )}
        </div>
      </Field>

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
              onReport={() => openPrintableReport(buildEntryReportHtml(selected))}
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
