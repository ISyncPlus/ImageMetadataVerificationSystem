import Link from "next/link";
import PageShell from "../components/PageShell";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import {
  ArrowLeft,
  Compass,
  Doc,
  HelpCircle,
  ShieldCheck,
} from "../components/ui/icons";

export const metadata = {
  title: "404 — Record Not Found | Provenance",
  description:
    "The requested page, verification record, or audit ledger document could not be located in the Provenance system.",
};

export default function NotFound() {
  return (
    <PageShell>
      <div className="py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "404 Not Found" },
          ]}
        />
      </div>

      <section className="flex flex-col items-center justify-center py-12 text-center sm:py-20">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-card">
            <span className="h-2 w-2 rounded-full bg-warn" />
            <span className="t-caption font-mono font-semibold text-ink">
              HTTP STATUS 404 · TELEMETRY MISS
            </span>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h1 className="t-display mt-6 max-w-2xl text-balance text-ink font-bold tracking-tight">
            The requested record or route does not exist.
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="t-body mx-auto mt-4 max-w-lg text-pretty text-ink-2">
            The verification certificate, audit sheet, or application route you are
            looking for may have expired, been relocated, or entered incorrectly.
          </p>
        </Reveal>

        <Reveal index={3} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" variant="primary" size="lg">
            <ArrowLeft size={16} />
            Return to Homepage
          </ButtonLink>
          <ButtonLink href="/login" size="lg">
            <ShieldCheck size={16} />
            Sign in to Inspector
          </ButtonLink>
        </Reveal>

        {/* Directory Recovery Grid */}
        <Reveal index={4} className="mt-14 w-full max-w-3xl text-left">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
            <p className="t-caption font-semibold uppercase tracking-wider text-accent">
              Quick Directory Navigation
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Link
                href="/case-studies"
                className="group flex flex-col justify-between rounded-xl border border-line bg-surface-2 p-4 transition-all hover:border-accent hover:bg-surface"
              >
                <div>
                  <Doc size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  <p className="t-callout mt-2 font-semibold text-ink">
                    Case Studies
                  </p>
                  <p className="t-caption mt-1 text-ink-2">
                    UNIZIK Geology &amp; Physics field verification benchmarks.
                  </p>
                </div>
                <span className="t-caption mt-3 font-semibold text-accent flex items-center gap-1">
                  View Cases &rarr;
                </span>
              </Link>

              <Link
                href="/student"
                className="group flex flex-col justify-between rounded-xl border border-line bg-surface-2 p-4 transition-all hover:border-accent hover:bg-surface"
              >
                <div>
                  <Compass size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  <p className="t-callout mt-2 font-semibold text-ink">
                    Student Inspector
                  </p>
                  <p className="t-caption mt-1 text-ink-2">
                    Upload photos for instantaneous in-browser telemetry checks.
                  </p>
                </div>
                <span className="t-caption mt-3 font-semibold text-accent flex items-center gap-1">
                  Open Inspector &rarr;
                </span>
              </Link>

              <Link
                href="/privacy"
                className="group flex flex-col justify-between rounded-xl border border-line bg-surface-2 p-4 transition-all hover:border-accent hover:bg-surface"
              >
                <div>
                  <HelpCircle size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  <p className="t-callout mt-2 font-semibold text-ink">
                    Privacy Policy
                  </p>
                  <p className="t-caption mt-1 text-ink-2">
                    Zero-upload client security and NDPR cryptographic compliance.
                  </p>
                </div>
                <span className="t-caption mt-3 font-semibold text-accent flex items-center gap-1">
                  Read Policy &rarr;
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
