"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageShell from "../components/PageShell";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import { BrandMark } from "../components/ui/BrandLogo";
import {
  Alert,
  Camera,
  Check,
  Clock,
  Copies,
  Doc,
  Pin,
  ShieldCheck,
} from "../components/ui/icons";
import { dashboardPathFor } from "../lib/auth";
import { useSession } from "../lib/useSession";
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

export default function LandingPage() {
  const session = useSession();
  const [specimenKey, setSpecimenKey] = useState<"authentic" | "tampered">("authentic");
  const specimen = SPECIMENS[specimenKey];

  return (
    <PageShell session={session}>
      {/* ------------------------------------------------------------- Hero */}
      <section className="flex flex-col items-center gap-6 pt-8 pb-12 text-center sm:pt-14 sm:pb-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-card">
            <BrandMark size={18} />
            <span className="t-caption font-medium text-ink">
              Provenance · Faculty of Physical Sciences, UNIZIK
            </span>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h1 className="t-display mx-auto max-w-4xl text-balance text-ink font-semibold tracking-[-0.03em]">
            Proof of origin for every academic image submission.
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="t-body mx-auto max-w-2xl text-pretty text-ink-2">
            Provenance replaces looking at a photo and guessing with mathematically
            auditing what the raw file records about itself — verifiable timestamps,
            GPS coordinates, camera hardware signatures, and cryptographic duplicate
            detection.
          </p>
        </Reveal>

        <Reveal index={3} className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {session ? (
            <>
              <ButtonLink
                href={dashboardPathFor(session.role)}
                variant="primary"
                size="lg"
              >
                Continue to {session.role === "lecturer" ? "Lecturer Ledger" : "Inspector"}
              </ButtonLink>
              <ButtonLink href="/login" size="lg">
                Switch account
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="primary" size="lg">
                Start verification
              </ButtonLink>
              <ButtonLink href="#interactive-demo" size="lg">
                Explore interactive demo
              </ButtonLink>
            </>
          )}
        </Reveal>
      </section>

      {/* ------------------------------------------- Interactive Specimen Demo */}
      <section id="interactive-demo" className="py-6">
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
                      ? "bg-accent text-accent-ink"
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
                      ? "bg-bad text-white"
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
                        Resolved Place & Coordinates
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
                  browser using native Web APIs (`exifr` and `crypto.subtle.digest`).
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

      {/* ---------------------------------------------------- Case Study Callout */}
      <section className="py-6">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-7 text-center shadow-card sm:flex-row sm:text-left">
            <div>
              <span className="t-caption font-bold uppercase tracking-wider text-accent">
                Academic Case Study
              </span>
              <h3 className="t-title-2 mt-1 text-ink">
                Faculty of Physical Sciences, Nnamdi Azikiwe University
              </h3>
              <p className="t-footnote mt-1 text-ink-2 max-w-xl">
                Engineered specifically for verifying practical coursework, laboratory
                experiments, geological fieldwork, and SIWES industrial training reports.
              </p>
            </div>
            <ButtonLink href="/login" variant="primary" size="md" className="shrink-0">
              Launch Provenance
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ Editorial Footer */}
      <Reveal>
        <footer className="mt-8 rounded-2xl border border-line bg-surface px-6 py-8 text-center shadow-card">
          <div className="flex flex-col items-center gap-2">
            <BrandMark size={28} />
            <p className="t-callout font-semibold tracking-wider text-ink uppercase">
              Provenance
            </p>
            <p className="t-footnote text-ink-2 max-w-md">
              Image Metadata &amp; Provenance Verification System — Final Year Thesis
              Project by Ebube Ezedimbu.
            </p>
            <p className="t-caption text-ink-3 max-w-lg mt-2">
              Case Study: Faculty of Physical Sciences, Nnamdi Azikiwe University,
              Awka. All computation executes locally inside the browser client.
            </p>
          </div>
        </footer>
      </Reveal>
    </PageShell>
  );
}
