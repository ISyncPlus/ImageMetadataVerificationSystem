import PageShell from "../../components/PageShell";
import Reveal from "../../components/ui/Reveal";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ButtonLink } from "../../components/ui/Button";
import {
  CheckCircle2,
  Doc,
  Mail,
  MapPin,
  ShieldCheck,
  Zap,
} from "../../components/ui/icons";

export const metadata = {
  title: "Privacy Policy & Zero-Upload Security Guarantee",
  description:
    "Learn how Provenance protects student privacy and research intellectual property through client-side WebAssembly EXIF parsing, local SHA-256 hashing, and zero raw photo uploads.",
  alternates: {
    canonical: "https://provenance-unizik.edu.ng/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />
      </div>

      <article className="mx-auto max-w-4xl py-6 sm:py-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-card">
            <ShieldCheck size={16} className="text-good" />
            <span className="t-caption font-medium text-ink">
              Privacy by Architecture · Effective September 2026
            </span>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h1 className="t-display mt-4 text-ink font-bold tracking-tight">
            Privacy Policy &amp; Data Protection Charter
          </h1>
          <p className="t-body mt-3 text-ink-2 max-w-2xl">
            Provenance was built on a foundational principle: **academic verification must never come at the cost of personal or research privacy.**
          </p>
        </Reveal>

        {/* Quick Highlights Matrix */}
        <Reveal index={2} className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-good-wash text-good">
              <CheckCircle2 size={18} />
            </span>
            <p className="t-callout mt-3 font-semibold text-ink">Zero Raw Uploads</p>
            <p className="t-caption mt-1 text-ink-2">
              Original full-resolution camera files never leave the browser buffer.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-wash text-accent">
              <Zap size={18} />
            </span>
            <p className="t-callout mt-3 font-semibold text-ink">Local Hashing</p>
            <p className="t-caption mt-1 text-ink-2">
              SHA-256 binary digests are calculated in-browser using WebCrypto.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-ink">
              <Doc size={18} />
            </span>
            <p className="t-callout mt-3 font-semibold text-ink">NDPR Compliant</p>
            <p className="t-caption mt-1 text-ink-2">
              Engineered to satisfy NDPR and academic records retention frameworks.
            </p>
          </div>
        </Reveal>

        {/* Policy Deep Dive Body */}
        <div className="mt-12 space-y-10 text-ink leading-relaxed">
          <section className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <h2 className="t-title-2 font-bold text-ink flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-mono">
                01
              </span>
              Client-Side Processing &amp; Execution Model
            </h2>
            <p className="t-body mt-4 text-ink-2">
              All binary parsing of exchangeable image file format (EXIF) tags, GPS coordinates, sensor hardware signatures, and timestamp auditing executes exclusively on the client device using native Web APIs and compiled WebAssembly (`exifr`). 
            </p>
            <p className="t-body mt-3 text-ink-2">
              The application does not stream, transmit, or cache full-resolution photograph binaries to external cloud servers, AI models, or third-party analysis services.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <h2 className="t-title-2 font-bold text-ink flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-mono">
                02
              </span>
              What Is Transmitted and Persisted
            </h2>
            <p className="t-body mt-4 text-ink-2">
              To allow departmental lecturers and lab supervisors to audit practical coursework, only the following derived verification telemetry is persisted to the institutional ledger:
            </p>
            <ul className="mt-4 space-y-2.5 pl-2 text-ink-2 t-body">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>SHA-256 Cryptographic Digest</strong>: A one-way mathematical fingerprint of the file bytes, used solely to detect cross-student duplicate submissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>Extracted Telemetry Summary</strong>: Sensor timestamp, resolved GPS latitude/longitude, camera make/model, and verification pass/fail verdicts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>Micro-Thumbnail (≤96px)</strong>: A highly compressed, downscaled visual reference preserved strictly so reviewers can confirm the specimen subject matter.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>Student Registration Metadata</strong>: Student name, registration number, course code, and submission timestamp.</span>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <h2 className="t-title-2 font-bold text-ink flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-mono">
                03
              </span>
              Geospatial Telemetry &amp; Location Privacy
            </h2>
            <p className="t-body mt-4 text-ink-2">
              When an image contains embedded GPS coordinates, the system performs a reverse geocode lookup (via OpenStreetMap Nominatim) to display human-readable landmark names (e.g. &ldquo;UNIZIK Faculty of Physical Sciences, Awka&rdquo;). No persistent continuous location tracking of the user or device occurs at any time.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <h2 className="t-title-2 font-bold text-ink flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-mono">
                04
              </span>
              Academic Integrity &amp; Record Retention
            </h2>
            <p className="t-body mt-4 text-ink-2">
              Verification audit records are maintained during the active academic session for grading, moderation, and accreditation reviews. In accordance with the Nigeria Data Protection Regulation (NDPR), students have the right to request review of flagged entries through their departmental head or course lecturer.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <h2 className="t-title-2 font-bold text-ink flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-mono">
                05
              </span>
              Contact Data Protection Office
            </h2>
            <p className="t-body mt-4 text-ink-2">
              For inquiries regarding telemetry data handling or technical audits, contact the project development and faculty administration team:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
                <MapPin size={18} className="text-accent shrink-0" />
                <span className="t-caption text-ink font-medium">
                  Faculty of Physical Sciences, Nnamdi Azikiwe University, Awka
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
                <Mail size={18} className="text-accent shrink-0" />
                <span className="t-caption text-ink font-mono">
                  provenance@unizik.edu.ng
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
          <ButtonLink href="/" size="md">
            &larr; Back to Home
          </ButtonLink>
          <ButtonLink href="/login" variant="primary" size="md">
            Launch Inspector &rarr;
          </ButtonLink>
        </div>
      </article>
    </PageShell>
  );
}
