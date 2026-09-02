import Link from "next/link";
import PageShell from "../../components/PageShell";
import Reveal from "../../components/ui/Reveal";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ButtonLink } from "../../components/ui/Button";
import {
  CheckCircle2,
  Clock,
  Doc,
  Download,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Zap,
} from "../../components/ui/icons";

export const metadata = {
  title: "Submission Verified & Confirmed | Provenance",
  description:
    "Your coursework image submission has been cryptographically audited and recorded in the departmental verification ledger.",
  alternates: {
    canonical: "https://provenance-unizik.edu.ng/thank-you",
  },
};

export default function ThankYouPage() {
  return (
    <PageShell>
      <div className="py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Submission Confirmed" },
          ]}
        />
      </div>

      <section className="mx-auto flex max-w-3xl flex-col items-center py-10 text-center sm:py-16">
        <Reveal>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-good-wash text-good shadow-lift ring-8 ring-good-wash/50">
            <CheckCircle2 size={36} strokeWidth={2.2} />
          </div>
        </Reveal>

        <Reveal index={1}>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1 shadow-card">
            <span className="h-2 w-2 rounded-full bg-good-mark" />
            <span className="t-caption font-mono font-semibold text-ink">
              AUDIT RECORD SECURED · HTTP 200 OK
            </span>
          </div>
        </Reveal>

        <Reveal index={2}>
          <h1 className="t-display mt-4 text-ink font-bold tracking-tight">
            Thank you! Telemetry successfully audited.
          </h1>
          <p className="t-body mx-auto mt-3 max-w-xl text-ink-2">
            Your fieldwork photograph has been analyzed in-browser and its cryptographic
            provenance record has been securely committed to the departmental ledger.
          </p>
        </Reveal>

        {/* Verification Summary Card */}
        <Reveal index={3} className="mt-10 w-full text-left">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                  Submission Status
                </p>
                <p className="t-title-3 font-bold text-good flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={18} />
                  Cryptographically Verified &amp; Signed
                </p>
              </div>
              <span className="t-caption rounded-lg border border-line bg-well px-3 py-1 font-mono text-ink-2">
                Response Time: ~24ms
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface-2 p-4">
                <span className="t-caption text-ink-3 font-medium flex items-center gap-1.5">
                  <Clock size={14} />
                  Timestamp Check
                </span>
                <p className="t-callout mt-1 font-semibold text-good">
                  Valid Sensor Clock
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5">Matches schedule</p>
              </div>

              <div className="rounded-xl border border-line bg-surface-2 p-4">
                <span className="t-caption text-ink-3 font-medium flex items-center gap-1.5">
                  <MapPin size={14} />
                  Geospatial Proximity
                </span>
                <p className="t-callout mt-1 font-semibold text-good">
                  Lab / Fieldsite Pass
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5">UNIZIK coordinates</p>
              </div>

              <div className="rounded-xl border border-line bg-surface-2 p-4">
                <span className="t-caption text-ink-3 font-medium flex items-center gap-1.5">
                  <Zap size={14} />
                  Duplicate Check
                </span>
                <p className="t-callout mt-1 font-semibold text-good">
                  Unique SHA-256
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5">Zero collision</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-line bg-well p-4">
              <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                Next Steps &amp; Grading Information
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-ink-2">
                <li>• Your course lecturer can now view your entry in the departmental ledger.</li>
                <li>• You can generate and print the official archival PDF certificate anytime from your dashboard.</li>
                <li>• Remember to keep the raw original photograph on your capture device until final grade publication.</li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Action Buttons */}
        <Reveal index={4} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/student" variant="primary" size="lg">
            <Zap size={16} />
            Inspect Another Image
          </ButtonLink>
          <ButtonLink href="/case-studies" size="lg">
            <Doc size={16} />
            View Academic Case Studies
          </ButtonLink>
          <ButtonLink href="/" size="lg">
            Return to Homepage
          </ButtonLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
