"use client";

import PageShell from "../components/PageShell";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import { Camera, Copies, Doc, ShieldCheck } from "../components/ui/icons";
import { dashboardPathFor } from "../lib/auth";
import { useSession } from "../lib/useSession";

const features = [
  {
    icon: Camera,
    title: "Metadata extraction",
    description:
      "EXIF capture time, GPS coordinates, and device details are read directly in the browser. The image itself never leaves the device.",
  },
  {
    icon: ShieldCheck,
    title: "Rule-based verification",
    description:
      "Four objective checks — time, location, device, and duplication — replace a subjective look at the picture.",
  },
  {
    icon: Copies,
    title: "Duplicate detection",
    description:
      "Every file is SHA-256 hashed and compared with earlier submissions, so a recycled photo is caught even after renaming.",
  },
  {
    icon: Doc,
    title: "Verification reports",
    description:
      "Per-image and summary reports print to PDF, giving lecturers an auditable record for departmental assessment.",
  },
];

const steps = [
  {
    step: "01",
    title: "A student submits",
    description:
      "They sign in and upload the original photo taken during practical work, fieldwork, or SIWES.",
  },
  {
    step: "02",
    title: "The system checks",
    description:
      "It reads the embedded metadata, runs the four consistency checks, and fingerprints the file for reuse.",
  },
  {
    step: "03",
    title: "A lecturer reviews",
    description:
      "They open the review dashboard, inspect anything flagged, and generate the verification report.",
  },
];

export default function LandingPage() {
  const session = useSession();

  return (
    <PageShell session={session}>
      <section className="flex flex-col items-center gap-6 py-10 text-center sm:py-16">
        <Reveal>
          <span className="t-caption inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-medium text-ink-2 shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-good-mark" />
            Prototype · Faculty of Physical Sciences, UNIZIK
          </span>
        </Reveal>

        <Reveal index={1}>
          <h1 className="t-display mx-auto max-w-3xl text-balance text-ink">
            Proof that a photo is what it claims to be
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="t-body mx-auto max-w-xl text-pretty text-ink-2">
            The Image Metadata Verification System replaces looking at a picture
            and guessing with reading what the file records about itself — when,
            where, and with which device it was captured, and whether it has been
            submitted before.
          </p>
        </Reveal>

        <Reveal index={3} className="flex flex-wrap items-center justify-center gap-3">
          {session ? (
            <>
              <ButtonLink
                href={dashboardPathFor(session.role)}
                variant="primary"
                size="lg"
              >
                Continue as {session.name.split(" ")[0]}
              </ButtonLink>
              <ButtonLink href="/login" size="lg">
                Switch account
              </ButtonLink>
            </>
          ) : (
            <ButtonLink href="/login" variant="primary" size="lg">
              Get started
            </ButtonLink>
          )}
        </Reveal>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Glyph, title, description }, index) => (
          <Reveal key={title} index={index}>
            <article className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-wash text-accent">
                <Glyph size={20} />
              </span>
              <h2 className="t-title-3 mt-4 text-ink">{title}</h2>
              <p className="t-footnote mt-2 text-ink-2">{description}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section id="how-it-works" className="flex flex-col gap-6 py-6">
        <Reveal className="text-center">
          <p className="t-footnote font-medium text-accent">How it works</p>
          <h2 className="t-title-1 mt-1.5 text-ink">
            From submission to verified report
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map(({ step, title, description }, index) => (
            <Reveal key={step} index={index}>
              <article className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card">
                <span className="tabular t-footnote font-semibold text-ink-3">
                  {step}
                </span>
                <h3 className="t-title-3 mt-3 text-ink">{title}</h3>
                <p className="t-footnote mt-2 text-ink-2">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <footer className="rounded-2xl border border-line bg-surface px-6 py-7 text-center shadow-card">
          <p className="t-footnote text-ink-2">
            Final year project — Design and Implementation of an Image Metadata
            Verification System
          </p>
          <p className="t-caption mx-auto mt-2 max-w-2xl text-ink-3">
            Case study: Faculty of Physical Sciences, Nnamdi Azikiwe University,
            Awka. All verification runs locally in the browser; no image is
            uploaded to any server.
          </p>
        </footer>
      </Reveal>
    </PageShell>
  );
}
