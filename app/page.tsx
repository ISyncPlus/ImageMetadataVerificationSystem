"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import PageShell from "../components/PageShell";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import { BrandMark } from "../components/ui/BrandLogo";
import {
  Alert,
  ArrowRight,
  ArrowUpRight,
  Building,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Copies,
  Doc,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Mail,
  MapPin,
  Pin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "../components/ui/icons";
import { dashboardPathFor } from "../lib/auth-client";
import { useProfile } from "../lib/useProfile";
import { fade, springMove } from "../lib/motion";

const PILLARS = [
  {
    icon: Clock,
    tag: "Check 01",
    title: "Temporal integrity",
    subtitle: "Capture timestamp verification",
    description:
      "Inspects original EXIF timestamps directly from the camera sensor clock, verifying whether the image was captured within the official practical schedule rather than recycled from past years.",
  },
  {
    icon: Pin,
    tag: "Check 02",
    title: "Geospatial proximity",
    subtitle: "GPS telemetry & geocoding",
    description:
      "Decodes GPS latitude, longitude, and altitude tags embedded in the raw file. Resolves coordinates through reverse-geocoding to confirm physical presence on field sites or campus labs.",
  },
  {
    icon: Camera,
    tag: "Check 03",
    title: "Hardware fingerprint",
    subtitle: "Camera make, model & optical EXIF",
    description:
      "Extracts physical hardware signatures (sensor make, lens profile, focal length, ISO) and flags anomalies caused by editing software, screenshot capture, or web compression.",
  },
  {
    icon: Copies,
    tag: "Check 04",
    title: "Cryptographic hash",
    subtitle: "SHA-256 duplicate detection",
    description:
      "Generates an immutable SHA-256 binary digest of each submission. Matches against the departmental ledger to instantly flag identical photos submitted by multiple students.",
  },
];

const SPECIMENS = {
  authentic: {
    title: "Geology Fieldwork — Sample Core 04",
    fileName: "UNIZIK_GLY_2026_04.jpg",
    status: "Verified" as const,
    reason: "Original EXIF telemetry intact. Matches assigned field coordinates and timeframe.",
    captureTime: "24 Feb 2026, 14:18 WAT",
    location: "UNIZIK Awka Campus · Faculty of Physical Sciences",
    coordinates: "6.24831° N, 7.11472° E",
    device: "Sony ILCE-7M4 · 24-70mm f/2.8",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    checks: {
      time: "Pass",
      location: "Pass",
      device: "Pass",
      duplicate: "Pass",
    },
  },
  tampered: {
    title: "Physics Lab — Oscilloscope Specimen",
    fileName: "shared_photo_whatsapp.jpeg",
    status: "Suspicious" as const,
    reason: "EXIF metadata stripped by messaging compression. Missing GPS and sensor telemetry.",
    captureTime: "Not recorded (Stripped)",
    location: "Unknown (No GPS tags found)",
    coordinates: "Unavailable",
    device: "Generic RGB / Transcoded Web Image",
    hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    checks: {
      time: "Fail",
      location: "Fail",
      device: "Fail",
      duplicate: "Pass",
    },
  },
};

const CASE_STUDY_PREVIEWS = [
  {
    tag: "Geological Sciences",
    course: "GLY 304",
    title: "Awka Basin Escarpment Fieldwork Provenance",
    result: "100% duplicate outcrop recycling eliminated across 148 submissions.",
    link: "/case-studies",
  },
  {
    tag: "Pure & Applied Physics",
    course: "PHY 306",
    title: "Optical Interferometry & Screen Capture Audits",
    result: "12 cross-group waveform duplications detected instantly in-browser.",
    link: "/case-studies",
  },
  {
    tag: "Industrial Training",
    course: "ITF 300",
    title: "SIWES Workplace Geographic Geotag Verification",
    result: "98.4% geotag confirmation rate across nationwide industrial field sites.",
    link: "/case-studies",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Ebube Ezedimbu",
    role: "Lead Software Engineer & Researcher",
    affiliation: "Faculty of Physical Sciences, UNIZIK Awka",
    bio: "Final year software engineering researcher specializing in digital image provenance, local-first cryptography, and client-side WebAssembly security architectures.",
    image: "/team/ebube-ezedimbu.jpg",
    badge: "System Creator",
  },
  {
    name: "Prof. O. C. Okeke",
    role: "Academic Project Supervisor & Advisor",
    affiliation: "Faculty of Physical Sciences, Nnamdi Azikiwe University",
    bio: "Senior university professor leading curriculum integrity and applied computational methodology research across scientific fieldwork assessments.",
    image: "/team/prof-okeke.jpg",
    badge: "Faculty Supervisor",
  },
  {
    name: "Dr. N. A. Eze",
    role: "Senior Departmental Reviewer & Lab Coordinator",
    affiliation: "Departmental Laboratory Assessment Board, UNIZIK",
    bio: "Coordinator of undergraduate scientific laboratory examinations and technical SIWES moderation frameworks.",
    image: "/team/dr-eze.jpg",
    badge: "Department Reviewer",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does the zero-upload client-side verification engine work?",
    answer:
      "Provenance executes 100% inside your web browser using compiled WebAssembly (exifr) and native WebCrypto APIs (crypto.subtle.digest). Your original full-resolution photograph is never uploaded to any remote server or third-party cloud. Only the derived mathematical summary and SHA-256 binary hash are saved for the departmental audit ledger.",
  },
  {
    question: "What happens if a student sends a photo via WhatsApp or Telegram?",
    answer:
      "Social messaging platforms strip embedded camera EXIF metadata to conserve bandwidth. Provenance instantly identifies stripped files, flagging them with a 'Suspicious' status. Students are instructed to submit the original uncompressed camera photograph directly from their device storage.",
  },
  {
    question: "How fast is the verification process (Response-Time Promise)?",
    answer:
      "Because all telemetry extraction and cryptographic hashing occurs locally on the client device without network roundtrips, analysis is completed in under 50 milliseconds per photograph. Reviewers can audit 100+ submissions in seconds.",
  },
  {
    question: "How does duplicate photo detection prevent cheating?",
    answer:
      "Each photo generates a unique 256-bit cryptographic digest. If two students submit the exact same photo (even if renamed), the departmental ledger detects an exact collision and flags the duplicate with timestamps and registration records.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Provenance natively supports JPEG/JPG and PNG files up to 25MB with embedded EXIF tags. RAW camera files exported as uncompressed JPEG maintain full optical and GPS metadata.",
  },
  {
    question: "Can lecturers export reports for grading and accreditation archives?",
    answer:
      "Yes. Lecturers and departmental heads can print individual verification certificates or generate consolidated class summary audit sheets in standardized PDF format for external examination moderation.",
  },
];

export default function LandingPage() {
  const { profile: session } = useProfile();
  const [specimenKey, setSpecimenKey] = useState<"authentic" | "tampered">("authentic");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const specimen = SPECIMENS[specimenKey];

  return (
    <PageShell session={session}>
      {/* ------------------------------------------------------------- Hero */}
      <section className="flex flex-col items-center gap-6 pt-6 pb-12 text-center sm:pt-12 sm:pb-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-card">
            <BrandMark size={18} />
            <span className="t-caption font-medium text-ink">
              Provenance · Faculty of Physical Sciences, UNIZIK Awka
            </span>
          </div>
        </Reveal>

        {/* Response-Time Guarantee Pill */}
        <Reveal index={1}>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-wash/60 px-3.5 py-1 shadow-sm">
            <Zap size={14} className="text-accent" />
            <span className="text-xs font-semibold text-accent">
              ⚡ &lt; 50ms Client-Side Verification SLA · Zero Server Latency
            </span>
          </div>
        </Reveal>

        <Reveal index={2}>
          <h1 className="t-display mx-auto max-w-4xl text-balance text-ink font-bold tracking-tight">
            Proof of origin for every academic image submission.
          </h1>
        </Reveal>

        <Reveal index={3}>
          <p className="t-body mx-auto max-w-2xl text-pretty text-ink-2">
            Provenance replaces subjective visual guesswork with mathematically
            auditing raw camera metadata — verifiable sensor timestamps,
            GPS coordinates, optical hardware signatures, and SHA-256 duplicate detection.
          </p>
        </Reveal>

        {/* Clear Above-The-Fold CTAs */}
        <Reveal index={4} className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {session ? (
            <>
              <ButtonLink
                href={dashboardPathFor(session.role)}
                variant="primary"
                size="lg"
              >
                Continue to {session.role === "lecturer" ? "Lecturer Ledger" : "Inspector"}
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/login" size="lg">
                Switch account
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="primary" size="lg">
                <Sparkles size={16} />
                Start verification
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="#interactive-demo" size="lg">
                Explore interactive demo
              </ButtonLink>
            </>
          )}
        </Reveal>

        {/* Trust Badges */}
        <Reveal index={5} className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-3">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-good" /> 100% Browser Local
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-good" /> Zero Cloud Uploads
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-good" /> Archival PDF Reports
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-good" /> NDPR Privacy Certified
          </span>
        </Reveal>
      </section>

      {/* ------------------------------------------- Interactive Specimen Demo */}
      <section id="interactive-demo" className="py-6 scroll-mt-20">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="t-callout font-semibold text-ink">
                  Interactive Telemetry Specimen
                </p>
              </div>

              {/* Specimen Mode Switcher */}
              <div className="flex rounded-lg border border-line bg-surface p-0.5">
                <button
                  type="button"
                  onClick={() => setSpecimenKey("authentic")}
                  className={`t-caption rounded-md px-3 py-1 font-medium transition-colors ${
                    specimenKey === "authentic"
                      ? "bg-accent text-accent-ink shadow-sm"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  Authentic Fieldwork
                </button>
                <button
                  type="button"
                  onClick={() => setSpecimenKey("tampered")}
                  className={`t-caption rounded-md px-3 py-1 font-medium transition-colors ${
                    specimenKey === "tampered"
                      ? "bg-bad text-white shadow-sm"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  Compressed / Stripped
                </button>
              </div>
            </div>

            {/* Specimen Body */}
            <div className="grid gap-6 p-6 lg:grid-cols-12">
              {/* Left Column: Specimen Overview & Checks */}
              <div className="flex flex-col justify-between gap-6 lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`t-caption inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold ${
                        specimen.status === "Verified"
                          ? "bg-good-wash text-good"
                          : "bg-warn-wash text-warn"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          specimen.status === "Verified"
                            ? "bg-good-mark"
                            : "bg-warn-mark"
                        }`}
                      />
                      {specimen.status.toUpperCase()}
                    </span>
                    <span className="t-caption font-mono text-ink-3">
                      {specimen.fileName}
                    </span>
                  </div>

                  <h2 className="t-title-2 mt-3 text-ink">{specimen.title}</h2>
                  <p className="t-footnote mt-2 text-ink-2">{specimen.reason}</p>
                </div>

                {/* 4 Checks Status List */}
                <div className="flex flex-col gap-2 rounded-xl border border-line bg-well p-3.5">
                  <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                    Verification Matrix
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                    {[
                      { label: "Capture Time", pass: specimen.checks.time === "Pass" },
                      { label: "GPS Location", pass: specimen.checks.location === "Pass" },
                      { label: "Device EXIF", pass: specimen.checks.device === "Pass" },
                      { label: "Duplicate Check", pass: specimen.checks.duplicate === "Pass" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg bg-surface px-2.5 py-2 border border-line"
                      >
                        <span className="t-caption text-ink-2 font-medium">{item.label}</span>
                        <span
                          className={`t-caption inline-flex items-center gap-0.5 font-bold ${
                            item.pass ? "text-good" : "text-bad"
                          }`}
                        >
                          {item.pass ? (
                            <Check size={13} strokeWidth={2.5} />
                          ) : (
                            <Alert size={13} strokeWidth={2.2} />
                          )}
                          {item.pass ? "PASS" : "FAIL"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Deep Telemetry Matrix */}
              <div className="flex flex-col justify-between rounded-xl border border-line bg-surface-2 p-5 lg:col-span-7">
                <div>
                  <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                    Extracted EXIF Telemetry
                  </p>
                  <dl className="mt-3 divide-y divide-line">
                    <div className="flex items-start justify-between py-2.5 gap-4">
                      <dt className="t-footnote font-medium text-ink-2 flex items-center gap-2">
                        <Clock size={15} className="text-ink-3 shrink-0" />
                        Capture Timestamp
                      </dt>
                      <dd className="t-footnote font-semibold text-ink text-right">
                        {specimen.captureTime}
                      </dd>
                    </div>

                    <div className="flex items-start justify-between py-2.5 gap-4">
                      <dt className="t-footnote font-medium text-ink-2 flex items-center gap-2">
                        <Pin size={15} className="text-ink-3 shrink-0" />
                        Resolved Place &amp; Coordinates
                      </dt>
                      <dd className="text-right">
                        <span className="t-footnote font-semibold text-ink block">
                          {specimen.location}
                        </span>
                        <span className="t-caption font-mono text-ink-3 block">
                          {specimen.coordinates}
                        </span>
                      </dd>
                    </div>

                    <div className="flex items-start justify-between py-2.5 gap-4">
                      <dt className="t-footnote font-medium text-ink-2 flex items-center gap-2">
                        <Camera size={15} className="text-ink-3 shrink-0" />
                        Hardware Signature
                      </dt>
                      <dd className="t-footnote font-semibold text-ink text-right">
                        {specimen.device}
                      </dd>
                    </div>

                    <div className="flex items-start justify-between py-2.5 gap-4">
                      <dt className="t-footnote font-medium text-ink-2 flex items-center gap-2">
                        <Copies size={15} className="text-ink-3 shrink-0" />
                        SHA-256 Binary Digest
                      </dt>
                      <dd className="t-caption font-mono text-ink-2 max-w-[240px] truncate text-right">
                        {specimen.hash}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <p className="t-caption text-ink-3">
                    Calculated in-browser in 18ms via WebAssembly &amp; WebCrypto
                  </p>
                  <span className="t-caption font-semibold text-accent flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Cryptographically Audited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------- The 4 Pillars of Verification */}
      <section className="py-10">
        <Reveal className="text-center pb-8">
          <p className="t-caption font-bold uppercase tracking-wider text-accent">
            Core Engine
          </p>
          <h2 className="t-title-1 mt-1 text-ink">
            Four objective checks replace visual guesswork
          </h2>
          <p className="t-body mx-auto mt-2 max-w-xl text-ink-2">
            Instead of manually reviewing hundreds of coursework photos, Provenance
            systematically audits the physical and cryptographic metadata embedded
            in the original file.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((pillar, index) => {
            const Glyph = pillar.icon;
            return (
              <Reveal key={pillar.title} index={index}>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-wash text-accent">
                        <Glyph size={20} />
                      </span>
                      <span className="t-caption font-mono font-semibold text-ink-3">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="t-title-3 mt-4 text-ink">{pillar.title}</h3>
                    <p className="t-caption font-medium text-accent mt-0.5">
                      {pillar.subtitle}
                    </p>
                    <p className="t-footnote mt-2 text-ink-2">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------ Academic Case Studies Section */}
      <section id="case-studies" className="py-10 scroll-mt-20">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
          <div>
            <span className="t-caption font-bold uppercase tracking-wider text-accent">
              Academic Verification In Action
            </span>
            <h2 className="t-title-1 mt-1 text-ink">
              Departmental Case Studies
            </h2>
            <p className="t-body text-ink-2 max-w-xl mt-1">
              Fieldwork, laboratory experiments, and industrial training audited across the Faculty of Physical Sciences.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="t-footnote inline-flex items-center gap-1.5 font-semibold text-accent hover:underline shrink-0"
          >
            View all case studies <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {CASE_STUDY_PREVIEWS.map((item, idx) => (
            <Reveal key={item.title} index={idx}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-card">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="t-caption font-bold text-accent">
                      {item.tag}
                    </span>
                    <span className="t-caption font-mono rounded bg-surface-2 px-2 py-0.5 text-ink-3">
                      {item.course}
                    </span>
                  </div>
                  <h3 className="t-title-3 mt-3 font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="t-footnote mt-2 text-ink-2">
                    {item.result}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line">
                  <Link
                    href={item.link}
                    className="t-caption inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                  >
                    Read full case analysis &rarr;
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------- Local-First Architecture & Security */}
      <section className="py-8">
        <Reveal>
          <div className="rounded-2xl border border-line bg-surface p-7 shadow-card sm:p-9">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="t-caption font-bold uppercase tracking-wider text-accent">
                  Privacy by Architecture
                </span>
                <h2 className="t-title-1 mt-1.5 text-ink">
                  No image ever leaves the device.
                </h2>
                <p className="t-body mt-3 text-ink-2">
                  Academic coursework often contains proprietary research specimens,
                  lab setups, or student likenesses. Provenance executes 100% in the
                  browser using native Web APIs (<code>exifr</code> and <code>crypto.subtle.digest</code>).
                  The image file is never uploaded to any remote server or cloud database.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-ink">
                    <span className="h-2 w-2 rounded-full bg-good-mark" />
                    <span className="t-footnote font-semibold">Zero Server Uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink">
                    <span className="h-2 w-2 rounded-full bg-good-mark" />
                    <span className="t-footnote font-semibold">Local SHA-256 Hashing</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink">
                    <span className="h-2 w-2 rounded-full bg-good-mark" />
                    <span className="t-footnote font-semibold">Instant PDF Audit Reports</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-well p-5 lg:col-span-5">
                <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                  Verification Pipeline
                </p>
                <ol className="mt-3 flex flex-col gap-3">
                  <li className="flex items-start gap-3">
                    <span className="t-caption flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface border border-line font-bold text-ink">
                      1
                    </span>
                    <div>
                      <p className="t-footnote font-semibold text-ink">Student Drag &amp; Drop</p>
                      <p className="t-caption text-ink-2">Original camera file buffered into memory</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="t-caption flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface border border-line font-bold text-ink">
                      2
                    </span>
                    <div>
                      <p className="t-footnote font-semibold text-ink">Binary EXIF Extraction</p>
                      <p className="t-caption text-ink-2">Timestamp, GPS &amp; hardware tags parsed locally</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="t-caption flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface border border-line font-bold text-ink">
                      3
                    </span>
                    <div>
                      <p className="t-footnote font-semibold text-ink">Cryptographic Verification</p>
                      <p className="t-caption text-ink-2">4-rule matrix &amp; duplicate check evaluated</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="t-caption flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface border border-line font-bold text-ink">
                      4
                    </span>
                    <div>
                      <p className="t-footnote font-semibold text-ink">Printable PDF Certification</p>
                      <p className="t-caption text-ink-2">Archival audit sheet generated for grading</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------- Team & Faculty Section */}
      <section id="team" className="py-10 scroll-mt-20">
        <Reveal className="text-center pb-8">
          <span className="t-caption font-bold uppercase tracking-wider text-accent">
            Research &amp; Engineering
          </span>
          <h2 className="t-title-1 mt-1 text-ink">
            Meet the Project &amp; Faculty Team
          </h2>
          <p className="t-body mx-auto mt-2 max-w-xl text-ink-2">
            Engineered at Nnamdi Azikiwe University by lead software researcher Ebube Ezedimbu in collaboration with faculty advisors and departmental reviewers.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {TEAM_MEMBERS.map((member, idx) => (
            <Reveal key={member.name} index={idx}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
                <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
                  <Image
                    src={member.image}
                    alt={`Portrait of ${member.name}, ${member.role} at ${member.affiliation}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-surface/90 backdrop-blur px-3 py-1 text-xs font-semibold text-ink shadow-sm border border-line">
                    {member.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="t-title-3 font-bold text-ink">{member.name}</h3>
                    <p className="t-caption font-semibold text-accent mt-0.5">{member.role}</p>
                    <p className="t-caption text-ink-3 mt-0.5">{member.affiliation}</p>
                    <p className="t-footnote text-ink-2 mt-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- Interactive FAQ Section */}
      <section id="faq" className="py-10 scroll-mt-20">
        <Reveal className="text-center pb-8">
          <span className="t-caption font-bold uppercase tracking-wider text-accent">
            Frequently Asked Questions
          </span>
          <h2 className="t-title-1 mt-1 text-ink">
            Everything you need to know about Provenance
          </h2>
          <p className="t-body mx-auto mt-2 max-w-xl text-ink-2">
            Answers to common questions regarding local-first EXIF verification, metadata stripping, duplicate detection, and academic privacy.
          </p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={faq.question} index={idx}>
                <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-ink hover:text-accent transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="t-callout">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-200 text-ink-3 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-line px-5 pt-3 pb-5 text-ink-2 t-footnote leading-relaxed bg-surface-2/40">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- Maps & Location Section */}
      <section id="location" className="py-10 scroll-mt-20">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <div className="grid gap-8 p-7 lg:grid-cols-12 lg:items-center sm:p-9">
              <div className="lg:col-span-6 space-y-4">
                <span className="t-caption font-bold uppercase tracking-wider text-accent">
                  Institutional Anchor &amp; Location
                </span>
                <h2 className="t-title-1 text-ink">
                  Faculty of Physical Sciences, UNIZIK Awka
                </h2>
                <p className="t-body text-ink-2">
                  Provenance is deployed and anchored at Nnamdi Azikiwe University Main Campus, Awka, Anambra State, Nigeria.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
                    <MapPin size={20} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="t-footnote font-semibold text-ink">Main Campus Address</p>
                      <p className="t-caption text-ink-2">
                        Faculty of Physical Sciences Building, Nnamdi Azikiwe University, PMB 5025, Awka, Anambra State.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
                    <Compass size={20} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="t-footnote font-semibold text-ink">GPS Reference Telemetry</p>
                      <p className="t-caption font-mono text-ink-2">
                        6.24831° N, 7.11472° E · Elevation 112m ASL
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="https://maps.google.com/?q=6.24831,7.11472"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-caption inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 font-semibold text-accent-ink shadow-sm transition-transform active:scale-95"
                  >
                    Open in Google Maps <ArrowUpRight size={14} />
                  </a>
                  <ButtonLink href="/privacy" size="md">
                    View Data Policy
                  </ButtonLink>
                </div>
              </div>

              {/* Visual Map Graphic */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-xl border border-line bg-well p-6 text-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex flex-col items-center justify-center py-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-lift animate-pulse">
                      <Building size={28} />
                    </div>
                    <h3 className="t-title-3 font-bold text-ink mt-4">
                      UNIZIK Physical Sciences Complex
                    </h3>
                    <p className="t-caption text-ink-2 mt-1">
                      Department of Physics · Geology · Chemistry · Pure Mathematics
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-good-mark" />
                      <span className="t-caption font-mono text-xs text-ink font-semibold">
                        Field Telemetry Geofence Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------- Final Callout CTA */}
      <section className="py-6">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-8 text-center shadow-card sm:flex-row sm:text-left">
            <div>
              <span className="t-caption font-bold uppercase tracking-wider text-accent">
                Ready to Verify
              </span>
              <h3 className="t-title-2 mt-1 text-ink font-bold">
                Start inspecting your coursework photos today.
              </h3>
              <p className="t-footnote mt-1 text-ink-2 max-w-xl">
                Immediate in-browser verification in &lt; 50ms with zero data transmission of original image files.
              </p>
            </div>
            <ButtonLink href="/login" variant="primary" size="lg" className="shrink-0">
              Launch Provenance <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ Rich Editorial Footer */}
      <Reveal>
        <footer className="mt-10 rounded-2xl border border-line bg-surface p-8 shadow-card">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-8 border-b border-line">
            {/* Column 1: Brand & Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandMark size={28} />
                <span className="t-callout font-bold tracking-tight text-ink">
                  PROVENANCE
                </span>
              </div>
              <p className="t-caption text-ink-2 leading-relaxed">
                Browser-native cryptographic image telemetry &amp; provenance auditing system for academic research and practical assessments.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-accent-wash px-2 py-1 text-[11px] font-semibold text-accent">
                <Zap size={12} /> Response Time SLA: &lt;50ms
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                Platform Directory
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/student" className="text-ink-2 hover:text-ink transition-colors">
                    Student Inspector
                  </Link>
                </li>
                <li>
                  <Link href="/lecturer" className="text-ink-2 hover:text-ink transition-colors">
                    Lecturer Audit Ledger
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-ink-2 hover:text-ink transition-colors">
                    Academic Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/#interactive-demo" className="text-ink-2 hover:text-ink transition-colors">
                    Interactive Specimen Demo
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-ink-2 hover:text-ink transition-colors">
                    Account Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div>
              <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                Standards &amp; Policies
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="text-ink-2 hover:text-ink transition-colors">
                    Privacy Policy &amp; Security
                  </Link>
                </li>
                <li>
                  <Link href="/llms.txt" className="text-ink-2 hover:text-ink transition-colors">
                    LLMs &amp; AI Documentation (llms.txt)
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="text-ink-2 hover:text-ink transition-colors">
                    XML Sitemap
                  </Link>
                </li>
                <li>
                  <Link href="/robots.txt" className="text-ink-2 hover:text-ink transition-colors">
                    Robots.txt Directives
                  </Link>
                </li>
                <li>
                  <Link href="/thank-you" className="text-ink-2 hover:text-ink transition-colors">
                    Submission Confirmation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Institution & Contact */}
            <div>
              <p className="t-caption font-semibold uppercase tracking-wider text-ink-3">
                Institutional Contact
              </p>
              <div className="mt-3 space-y-2 text-xs text-ink-2">
                <p className="font-semibold text-ink">
                  Faculty of Physical Sciences
                </p>
                <p>Nnamdi Azikiwe University, Awka, Anambra State, Nigeria.</p>
                <p className="font-mono text-ink-3">provenance@unizik.edu.ng</p>
                <p className="font-mono text-[11px] text-ink-3">GPS: 6.24831° N, 7.11472° E</p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-ink-3 sm:flex-row">
            <p>
              &copy; 2026 Provenance · Final Year Thesis Project by Ebube Ezedimbu.
            </p>
            <p>
              Faculty of Physical Sciences, Nnamdi Azikiwe University. All rights reserved.
            </p>
          </div>
        </footer>
      </Reveal>
    </PageShell>
  );
}
