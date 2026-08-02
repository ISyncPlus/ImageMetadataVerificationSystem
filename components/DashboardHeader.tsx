import Reveal from "./ui/Reveal";
import StatusMeter from "./ui/StatusMeter";
import Ticker from "./ui/Ticker";

export type DashboardStats = {
  total: number;
  verified: number;
  suspicious: number;
  reused: number;
};

type DashboardHeaderProps = {
  stats: DashboardStats;
  eyebrow: string;
  title: string;
  subtitle?: string;
};

type Tone = "neutral" | "good" | "warn" | "bad";

const DOTS: Record<Tone, string> = {
  neutral: "bg-ink-3",
  good: "bg-good-mark",
  warn: "bg-warn-mark",
  bad: "bg-bad-mark",
};

/** The number is the point, so it wears ink; the dot beside the label carries
 *  which status it belongs to. */
function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: Tone;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOTS[tone]}`} />
        <p className="t-caption truncate font-medium text-ink-2">{label}</p>
      </div>
      <p className="mt-2 text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-ink">
        <Ticker value={value} />
      </p>
      <p className="t-caption mt-1.5 text-ink-3">{hint}</p>
    </div>
  );
}

export default function DashboardHeader({
  stats,
  eyebrow,
  title,
  subtitle,
}: DashboardHeaderProps) {
  const verifiedRate =
    stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0;

  return (
    <header className="flex flex-col gap-6">
      <Reveal>
        <p className="t-footnote font-medium text-accent">{eyebrow}</p>
        <h1 className="t-title-1 mt-1.5 text-ink">{title}</h1>
        {subtitle ? (
          <p className="t-body mt-2 max-w-2xl text-ink-2">{subtitle}</p>
        ) : null}
      </Reveal>

      <Reveal index={1} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Submissions"
            value={stats.total}
            hint="Checked in total"
            tone="neutral"
          />
          <StatTile
            label="Verified"
            value={stats.verified}
            hint="All four checks passed"
            tone="good"
          />
          <StatTile
            label="Suspicious"
            value={stats.suspicious}
            hint="Missing time, place or device"
            tone="warn"
          />
          <StatTile
            label="Reused"
            value={stats.reused}
            hint="Matches an earlier file"
            tone="bad"
          />
        </div>

        {stats.total > 0 ? (
          <div className="flex flex-col gap-2">
            <StatusMeter
              total={stats.total}
              counts={{
                Verified: stats.verified,
                Suspicious: stats.suspicious,
                Reused: stats.reused,
              }}
            />
            <p className="t-caption text-ink-2">
              <span className="tabular font-semibold text-ink">
                {verifiedRate}%
              </span>{" "}
              verified across {stats.total}{" "}
              {stats.total === 1 ? "submission" : "submissions"}
            </p>
          </div>
        ) : null}
      </Reveal>
    </header>
  );
}
