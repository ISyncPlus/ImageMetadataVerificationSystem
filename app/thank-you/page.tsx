import PageShell from "../../components/PageShell";
import Field from "../../components/ui/Field";
import Reveal from "../../components/ui/Reveal";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ButtonLink } from "../../components/ui/Button";
import { Check, Clock, Copies, Doc, Pin } from "../../components/ui/icons";

export const metadata = {
  title: "Submission Verified & Confirmed | Provenance",
  description:
    "Your coursework image submission has been cryptographically audited and recorded in the departmental verification ledger.",
  alternates: {
    canonical: "https://provenance-unizik.edu.ng/thank-you",
  },
};

const READINGS = [
  {
    icon: Clock,
    label: "Capture time",
    value: "Sensor clock valid",
    note: "Inside the scheduled window",
  },
  {
    icon: Pin,
    label: "GPS location",
    value: "Within the geofence",
    note: "Resolved to UNIZIK coordinates",
  },
  {
    icon: Copies,
    label: "Duplicate check",
    value: "Digest unique",
    note: "No collision in the ledger",
  },
];

export default function ThankYouPage() {
  return (
    <PageShell stamp="Provenance — Record Filed">
      <Field pad="none" className="pt-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Submission filed" }]}
        />
      </Field>

      <Field pad="md">
        <div className="flex items-center gap-4">
          <span className="t-mark text-good">Filed</span>
          <span className="t-mark text-ink-2">Record secured</span>
          <span className="rule-draw h-px flex-1 bg-rule" />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h1 className="t-headline text-balance text-ink">
              Audited, and committed to the ledger.
            </h1>
            <p className="t-body mt-6 max-w-xl text-pretty text-ink-2">
              The photograph was read on your own device and its provenance
              record — digest, telemetry, verdict — has been filed to the
              departmental ledger. The image itself never left.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/student" variant="primary" size="lg" arrow>
                Check another photo
              </ButtonLink>
              <ButtonLink href="/case-studies" size="lg" variant="secondary">
                <Doc size={16} />
                Read the case studies
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal index={1} className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
              <div className="flex items-center justify-between gap-3 border-b border-rule bg-good-wash px-4 py-3">
                <span className="t-mark flex items-center gap-2 text-good">
                  <Check size={13} strokeWidth={2.6} />
                  Verified
                </span>
                <span className="t-num text-[0.6875rem] text-good">
                  4 / 4 CHECKS
                </span>
              </div>

              <dl className="ruled px-4">
                {READINGS.map((reading) => {
                  const Glyph = reading.icon;
                  return (
                    <div key={reading.label} className="flex items-start gap-3 py-3.5">
                      <Glyph size={15} className="mt-0.5 shrink-0 text-ink-3" />
                      <div className="min-w-0 flex-1">
                        <dt className="t-mark text-ink-3">{reading.label}</dt>
                        <dd className="t-footnote mt-1 font-semibold text-ink">
                          {reading.value}
                        </dd>
                        <dd className="t-caption text-ink-3">{reading.note}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          </Reveal>
        </div>
      </Field>

      <Field tone="ink" bleed pad="md">
        <div className="bleed-inner">
          <p className="t-mark text-ink-3">What happens next</p>
          <ol className="ruled mt-4 border-y border-rule">
            {[
              "Your course lecturer can now see this entry in the departmental ledger.",
              "The archival PDF certificate can be printed from your dashboard at any time.",
              "Keep the original photograph on your capture device until grades are published.",
            ].map((line, index) => (
              <li key={line} className="flex items-start gap-5 py-4">
                <span className="t-num shrink-0 text-[0.8125rem] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="t-callout text-ink-2">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </Field>
    </PageShell>
  );
}
