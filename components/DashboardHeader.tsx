import type { ReactNode } from "react";
import Field from "./ui/Field";
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
  /** Mono stamp — which desk this file belongs to. */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Sits opposite the title: the reader's own credentials. */
  slip?: ReactNode;
};

type Tone = "neutral" | "good" | "warn" | "bad";

const MARKS: Record<Tone, string> = {
  neutral: "bg-ink-3",
  good: "bg-good-mark",
  warn: "bg-warn-mark",
  bad: "bg-bad-mark",
};

/**
 * A reading, not a tile. The figure is set in mono at display size so a column
 * of them scans as a column; the dot beside the label is what carries which
 * status it belongs to, because the number itself must stay in ink to be read.
 */
function Reading({
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
    <div className="px-5 py-6 first:pl-0 sm:py-7">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${MARKS[tone]}`} />
        <p className="t-mark truncate text-ink-2">{label}</p>
      </div>
      <p className="t-num mt-3 text-[2rem] leading-none text-ink sm:text-[2.5rem]">
        <Ticker value={value} />
      </p>
      <p className="t-caption mt-2 text-ink-3">{hint}</p>
    </div>
  );
}

/**
 * The masthead of a dashboard: who is reading, what they are reading, and the
 * four numbers that summarise it.
 *
 * The readings live on their own inverted band running the full width of the
 * page rather than in a row of cards. Four boxes on a light ground read as four
 * separate things; one dark band reads as the instrument panel of the file
 * below it — and it gives the page a horizontal beat before the work starts.
 */
export default function DashboardHeader({
  stats,
  eyebrow,
  title,
  subtitle,
  slip,
}: DashboardHeaderProps) {
  const verifiedRate =
    stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0;

  return (
    <>
      <Field pad="none" className="pb-10 pt-6 sm:pt-10">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="t-mark text-accent-deep">{eyebrow}</span>
            <span className="rule-draw h-px flex-1 bg-rule" />
          </div>
        </Reveal>

        <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal index={1} className="lg:col-span-7">
            <h1 className="t-title-1 text-balance text-ink">{title}</h1>
            {subtitle ? (
              <p className="t-callout mt-4 max-w-2xl text-pretty text-ink-2">
                {subtitle}
              </p>
            ) : null}
          </Reveal>

          {slip ? (
            <Reveal index={2} className="lg:col-span-5 lg:justify-self-end">
              {slip}
            </Reveal>
          ) : null}
        </div>
      </Field>

      <Field tone="ink" bleed pad="none">
        <div className="bleed-inner">
          <div className="ruled-x grid grid-cols-2 sm:grid-cols-4">
            <Reading
              label="Submissions"
              value={stats.total}
              hint="Filed in total"
              tone="neutral"
            />
            <Reading
              label="Verified"
              value={stats.verified}
              hint="Four of four checks"
              tone="good"
            />
            <Reading
              label="Suspicious"
              value={stats.suspicious}
              hint="Time, place or device missing"
              tone="warn"
            />
            <Reading
              label="Reused"
              value={stats.reused}
              hint="Matches an earlier file"
              tone="bad"
            />
          </div>

          {stats.total > 0 ? (
            <div className="flex flex-col gap-3 border-t border-rule py-5 sm:flex-row sm:items-center sm:gap-6">
              <p className="t-mark shrink-0 text-ink-2">
                <span className="t-num mr-1.5 text-[0.875rem] text-ink">
                  {verifiedRate}%
                </span>
                verified
              </p>
              <div className="flex-1">
                <StatusMeter
                  total={stats.total}
                  counts={{
                    Verified: stats.verified,
                    Suspicious: stats.suspicious,
                    Reused: stats.reused,
                  }}
                />
              </div>
              <p className="t-mark shrink-0 text-ink-3">
                {stats.total} {stats.total === 1 ? "record" : "records"}
              </p>
            </div>
          ) : null}
        </div>
      </Field>
    </>
  );
}
