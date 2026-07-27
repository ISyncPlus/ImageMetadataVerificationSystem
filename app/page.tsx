"use client";

import Link from "next/link";
import PageShell from "../components/PageShell";
import { dashboardPathFor } from "../lib/auth";
import { useSession } from "../lib/useSession";

const features = [
  {
    title: "Metadata Extraction",
    description:
      "EXIF capture time, GPS coordinates, and device information are extracted directly in the browser — the image never leaves the device.",
  },
  {
    title: "Rule-Based Verification",
    description:
      "Four objective checks — capture time, location, device, and duplicate detection — replace subjective visual inspection.",
  },
  {
    title: "Duplicate Detection",
    description:
      "Every file is SHA-256 hashed and compared against previous submissions to flag reused or recycled evidence.",
  },
  {
    title: "Verification Reports",
    description:
      "Printable per-image and summary reports give lecturers a clear, auditable record for departmental assessments.",
  },
];

const steps = [
  {
    step: "01",
    title: "Student submits",
    description:
      "A student signs in and uploads the original photo taken during practical work, fieldwork, or SIWES.",
  },
  {
    step: "02",
    title: "System verifies",
    description:
      "The prototype extracts embedded metadata, runs consistency checks, and hashes the file for reuse detection.",
  },
  {
    step: "03",
    title: "Lecturer reviews",
    description:
      "The lecturer opens the review dashboard, inspects flagged submissions, and generates verification reports.",
  },
];

export default function LandingPage() {
  const session = useSession();

  return (
    <PageShell>
      {/* Hero */}
      <section className="flex flex-col items-center gap-8 pt-6 text-center md:pt-16">
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-200/90">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          Prototype · Faculty of Physical Sciences, UNIZIK
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          Verify the authenticity of academic image submissions
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          The Image Metadata Verification System replaces subjective visual
          inspection with objective metadata analysis — verifying when, where,
          and with which device an image was captured, and detecting reuse
          across submissions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {session ? (
            <Link
              href={dashboardPathFor(session.role)}
              className="rounded-full border border-cyan-400/50 bg-cyan-400/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/30"
            >
              Continue as {session.name.split(" ")[0]}
            </Link>
          ) : null}
          <Link
            href="/login"
            className={
              session
                ? "rounded-full border border-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-cyan-400/50 hover:text-cyan-200"
                : "rounded-full border border-cyan-400/50 bg-cyan-400/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/30"
            }
          >
            {session ? "Switch account" : "Get started"}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/40"
          >
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            From submission to verified report
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <span className="text-3xl font-semibold text-cyan-300/60">
                {item.step}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur">
        <p className="text-sm text-white/60">
          Final Year Project — Design and Implementation of an Image Metadata
          Verification System
        </p>
        <p className="mt-2 text-xs text-white/40">
          Case study: Faculty of Physical Sciences, Nnamdi Azikiwe University,
          Awka. All verification runs locally in the browser; no image is
          uploaded to any server.
        </p>
      </footer>
    </PageShell>
  );
}
