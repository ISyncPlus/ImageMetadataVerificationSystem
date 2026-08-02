"use client";

import { useMemo, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import HistoryList from "../../components/HistoryList";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Sheet from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import { Doc, Search } from "../../components/ui/icons";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import { clearHistory } from "../../lib/storage";
import { useHistory } from "../../lib/useHistory";
import { useRequireSession } from "../../lib/useSession";
import type { HistoryEntry, VerificationStatus } from "../../lib/types";

type StatusFilter = "All" | VerificationStatus;

const FILTERS: readonly StatusFilter[] = [
  "All",
  "Verified",
  "Suspicious",
  "Reused",
];

export default function LecturerDashboard() {
  const session = useRequireSession("lecturer");
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
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
        (entry.submittedBy?.identifier.toLowerCase().includes(lowered) ?? false)
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
        eyebrow="Lecturer"
        title="Submission review"
        subtitle="Inspect what each image records about its own capture, follow up on flagged submissions, and generate reports for assessment records."
      />

      <Card
        title="Student submissions"
        subtitle={
          filtered.length === history.length
            ? `${history.length} on record`
            : `${filtered.length} of ${history.length} shown`
        }
        actions={
          <>
            <Button
              size="sm"
              onClick={handleSummaryReport}
              disabled={filtered.length === 0}
            >
              <Doc size={15} />
              Summary report
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setConfirmingClear(true)}
              disabled={history.length === 0}
            >
              Clear records
            </Button>
          </>
        }
        bodyClassName="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:max-w-xs lg:flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, reg. number or file"
              aria-label="Search submissions"
              className="t-footnote min-h-10 w-full rounded-full border border-line bg-well py-2 pl-9 pr-4 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent"
            />
          </div>
          <div className="-mx-1 overflow-x-auto px-1 lg:ml-auto">
            <SegmentedControl
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              label="Filter by status"
            />
          </div>
        </div>

        <HistoryList
          entries={filtered}
          showSubmitter
          onEntryReport={handleEntryReport}
          emptyMessage={
            history.length === 0
              ? "No submissions yet. Records appear here as students verify their images."
              : "Nothing matches that search or filter."
          }
        />
      </Card>

      {/* Irreversible, so it asks first — the one place in the app that does. */}
      <Sheet
        open={confirmingClear}
        onClose={() => setConfirmingClear(false)}
        title="Clear all records?"
        subtitle={`${history.length} verification ${
          history.length === 1 ? "record" : "records"
        } on this device`}
      >
        <div className="flex flex-col gap-5">
          <p className="t-callout text-ink-2">
            This permanently removes every stored verification from this browser,
            including the hashes used to detect reused images. It cannot be undone,
            and reports you have not already printed will be lost.
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
              Clear {history.length} {history.length === 1 ? "record" : "records"}
            </Button>
            <Button className="sm:flex-1" onClick={() => setConfirmingClear(false)}>
              Keep them
            </Button>
          </div>
        </div>
      </Sheet>
    </PageShell>
  );
}
