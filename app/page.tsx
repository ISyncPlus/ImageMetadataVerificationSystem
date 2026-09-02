"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PageShell from "../components/PageShell";
import Field from "../components/ui/Field";
import Exhibit from "../components/ui/Exhibit";
import Marquee from "../components/ui/Marquee";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import { BrandMark } from "../components/ui/BrandLogo";
import {
  Alert,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Copies,
  MapPin,
  Pin,
  ShieldCheck,
} from "../components/ui/icons";
import { dashboardPathFor } from "../lib/auth-client";
import { useProfile } from "../lib/useProfile";
import { useMediaQuery } from "../lib/useMediaQuery";
import ForensicScan from "../components/ui/ForensicScan";
import RadarPing from "../components/ui/RadarPing";
import CryptographicStream from "../components/ui/CryptographicStream";
import { ScrollSplitCard } from "../components/ui/scroll-split-card";
import type { RailMark } from "../components/ui/DossierRail";

/* The rail reads these to tell the visitor where in the file they are. */
const RAIL: readonly RailMark[] = [
  { id: "brief", index: "01", label: "Brief" },
  { id: "method", index: "02", label: "Method" },
  { id: "interactive-demo", index: "03", label: "Specimen" },
  { id: "checks", index: "04", label: "Checks" },
  { id: "architecture", index: "05", label: "Architecture" },
  { id: "case-studies", index: "06", label: "Cases" },
  { id: "team", index: "07", label: "Team" },
  { id: "faq", index: "08", label: "Questions" },
  { id: "location", index: "09", label: "Anchor" },
];

const SPLIT_CARDS = [
  {
    title: "Temporal sensor clock",
    description:
      "Reads the original capture timestamp straight off the camera's sensor clock and tests it against the scheduled practical window.",
    bgColor: "#17151a",
    textColor: "#f6f4f1",
    icon: <Clock size={26} className="text-accent" />,
  },
  {
    title: "SHA-256 binary digest",
    description:
      "Derives an immutable 256-bit hash. Server-authoritative matching flags a file resubmitted under any name, by any student.",
    bgColor: "#cf3f1d",
    textColor: "#fff8f5",
    icon: <ShieldCheck size={26} className="text-white" />,
  },
  {
    title: "Geodetic GPS telemetry",
    description:
      "Extracts latitude, longitude and altitude, then reverse-geocodes them against the faculty's laboratory and fieldwork geofences.",
    bgColor: "#17151a",
    textColor: "#f6f4f1",
    icon: <Pin size={26} className="text-accent" />,
  },
];

const LEDGER_STRIP = [
  "Client-side EXIF extraction",
  "SHA-256 duplicate ledger",
  "Zero image upload",
  "Reverse-geocoded coordinates",
  "Sensor hardware signatures",
  "Printable audit certificates",
  "Works offline",
];

const CHECKS = [
  {
    icon: Clock,
    index: "01",
    title: "Temporal integrity",
    subtitle: "Capture timestamp",
    description:
      "Reads the original EXIF timestamp written by the camera's own clock, and tests whether the photograph was taken inside the scheduled practical window rather than recycled from a previous year.",
    signal: "DateTimeOriginal",
  },
  {
    icon: Pin,
    index: "02",
    title: "Geospatial proximity",
    subtitle: "GPS telemetry",
    description:
      "Decodes the latitude, longitude and altitude embedded in the raw file — from the EXIF GPS block, an XMP packet, or a PNG's eXIf chunk. Where a file carries none, the specimen can instead be photographed inside Provenance, which reads the device position as the shutter fires.",
    signal: "GPSLatitude · GPSLongitude · eXIf · XMP",
  },
  {
    icon: Camera,
    index: "03",
    title: "Hardware fingerprint",
    subtitle: "Optical signature",
    description:
      "Extracts the sensor make, lens profile, focal length and ISO. Their absence is itself evidence: editing software, screenshots and messaging apps all leave the same gap.",
    signal: "Make · Model · FocalLength",
  },
  {
    icon: Copies,
    index: "04",
    title: "Cryptographic identity",
    subtitle: "Duplicate detection",
    description:
      "Hashes the file to a 256-bit digest and matches it against the departmental ledger, so an identical photograph submitted twice is caught across students, not merely within one.",
    signal: "SHA-256 · crypto.subtle",
  },
];

const PIPELINE = [
  {
    step: "01",
    title: "Buffered on device",
    detail: "The original camera file is read into memory. It never leaves.",
  },
  {
    step: "02",
    title: "Binary EXIF parse",
    detail: "Timestamp, GPS and hardware tags decoded locally by exifr.",
  },
  {
    step: "03",
    title: "Verdict derived",
    detail: "Four rules evaluated, then re-derived server-side against the ledger.",
  },
  {
    step: "04",
    title: "Certificate issued",
    detail: "An archival audit sheet, printable for moderation and grading.",
  },
];

const SPECIMENS = {
  authentic: {
    title: "Geology fieldwork: sample core 04",
    fileName: "UNIZIK_GLY_2026_04.jpg",
    status: "Verified" as const,
    reason:
      "Original EXIF telemetry intact. Coordinates and capture window both match the assigned field exercise.",
    captureTime: "24 Feb 2026, 14:18 WAT",
    location: "UNIZIK Awka Campus · Faculty of Physical Sciences",
    coordinates: "6.24831° N, 7.11472° E",
    device: "Sony ILCE-7M4 · 24-70mm f/2.8",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    checks: { time: "Pass", location: "Pass", device: "Pass", duplicate: "Pass" },
  },
  tampered: {
    title: "Physics lab: oscilloscope specimen",
    fileName: "shared_photo_whatsapp.jpeg",
    status: "Suspicious" as const,
    reason:
      "EXIF metadata stripped by messaging compression. No GPS tags and no sensor telemetry survived the transcode.",
    captureTime: "Not recorded — stripped",
    location: "Unknown — no GPS tags found",
    coordinates: "Unavailable",
    device: "Generic RGB · transcoded web image",
    hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    checks: { time: "Fail", location: "Fail", device: "Fail", duplicate: "Pass" },
  },
};

const CASE_STUDIES = [
  {
    tag: "Geological Sciences",
    course: "GLY 304",
    title: "Structural rock core and mineral outcrop provenance",
    result:
      "Recycled outcrop photography eliminated across 186 field specimens in a single session.",
    figure: "186",
    figureLabel: "specimens audited",
  },
  {
    tag: "Pure & Industrial Physics",
    course: "PHY 306",
    title: "Laser interferometry and oscilloscope capture audits",
    result: "14 cross-group waveform duplications surfaced by hash collision.",
    figure: "14",
    figureLabel: "duplicates caught",
  },
  {
    tag: "Pure & Industrial Chemistry",
    course: "ICH 312",
    title: "Spectrophotometric assays and TLC plate provenance",
    result: "28 captures fell outside the scheduled laboratory hours.",
    figure: "28",
    figureLabel: "timestamp violations",
  },
];

const TEAM = [
  {
    name: "Ebube Ezedimbu",
    role: "Lead software engineer & researcher",
    affiliation: "Faculty of Physical Sciences, UNIZIK Awka",
    bio: "Final-year software engineering researcher working on digital image provenance, local-first cryptography, and client-side security architecture.",
    image: "/team/ebube-ezedimbu.jpg",
    badge: "System creator",
  },
  {
    name: "Prof. O. C. Okeke",
    role: "Academic project supervisor",
    affiliation: "Faculty of Physical Sciences, Nnamdi Azikiwe University",
    bio: "Leads curriculum integrity and applied computational methodology research across scientific fieldwork assessment.",
    image: "/team/prof-okeke.jpg",
    badge: "Faculty supervisor",
  },
  {
    name: "Dr. N. A. Eze",
    role: "Senior departmental reviewer",
    affiliation: "Departmental Laboratory Assessment Board, UNIZIK",
    bio: "Coordinates undergraduate laboratory examinations and technical SIWES moderation frameworks.",
    image: "/team/dr-eze.jpg",
    badge: "Department reviewer",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does verification work without uploading the photo?",
    answer:
      "Everything that reads the image runs inside your browser: exifr parses the file's EXIF segment, and crypto.subtle.digest computes the SHA-256 hash. The full-resolution photograph is never transmitted. What gets filed is the derived record — the digest, the extracted values, the verdict — together with a thumbnail no larger than 96 pixels, so a reviewer can see what was submitted.",
  },
  {
    question: "What happens to a photo sent through WhatsApp or Telegram?",
    answer:
      "Messaging platforms strip embedded EXIF metadata to save bandwidth, which removes exactly the evidence this system reads. Provenance recognises the resulting gap and marks the file Suspicious. Submit the original file from your camera roll or device storage instead of a version that has been forwarded.",
  },
  {
    question: "How fast is a check?",
    answer:
      "Parsing and hashing happen locally with no network round-trip, so a verdict typically appears in well under a tenth of a second. A reviewer can work through a hundred submissions without waiting on anything but their own reading speed.",
  },
  {
    question: "How does duplicate detection actually prevent reuse?",
    answer:
      "Each file resolves to one 256-bit digest. Renaming a photograph does not change it. The server holds the digests of every submission in the department and compares each new one against all of them, so the same image submitted by two students collides immediately — with both registration numbers and both timestamps attached.",
  },
  {
    question: "What if the photo has no location in it at all?",
    answer:
      "That is the common case, not the exception: a phone writes GPS into a photograph only while its camera app holds location permission, and WhatsApp, Telegram and Signal all strip it from images sent as photos. No parser can recover a coordinate that was never written — so instead the specimen can be captured inside Provenance, where the device position is read at the instant the shutter fires and bound to the record. Where a student uploads an existing file, their device position can be attached as an attestation: it is recorded and shown to the reviewer, but never counted towards the verdict, because it says where the student was when submitting rather than where the photograph was taken.",
  },
  {
    question: "Which formats are supported?",
    answer:
      "JPEG and PNG up to 25 MB, with EXIF tags intact. RAW files exported as uncompressed JPEG keep their optical and GPS metadata. HEIC is rejected with an explanation, because browsers routinely lose its metadata during decode.",
  },
  {
    question: "Can lecturers export records for accreditation archives?",
    answer:
      "Yes. Individual verification certificates and consolidated class summary sheets both print to a standard archival layout suitable for external examination moderation.",
  },
];

export default function LandingPage() {
  const { profile: session } = useProfile();
  const reduced = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 639px)");
  const [specimenKey, setSpecimenKey] = useState<"authentic" | "tampered">(
    "authentic"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const specimen = SPECIMENS[specimenKey];
  const verified = specimen.status === "Verified";

  return (
    <PageShell session={session} rail={RAIL} showMobileCta>
      {/* ============================================================ 01 BRIEF */}
      <Field id="brief" pad="none" className="scroll-mt-28 pb-16 pt-10 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* The reading column: stamp, statement, action. Left-aligned and
              off-centre, because a centred hero is the one shape every other
              product on the internet already has. */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="t-mark text-accent-deep">File 01</span>
                <span className="t-mark text-ink-2">Proof of origin</span>
                <span className="rule-draw h-px flex-1 bg-rule" />
              </div>
            </Reveal>

            <Reveal index={1}>
              <h1 className="t-display mt-8 text-balance text-ink">
                Proof of origin for every academic image.
              </h1>
            </Reveal>

            <Reveal index={2}>
              <p className="t-body mt-7 max-w-xl text-pretty text-ink-2">
                Reviewers have always judged coursework photographs by looking at
                them. Provenance replaces that guess with an audit of what the
                camera itself recorded: the sensor&apos;s timestamp, the coordinates,
                the hardware signature, and a hash that no rename survives.
              </p>
            </Reveal>

            {/* Full width and stacked on a phone: two capsules of different
                lengths wrapping onto separate lines reads as a mistake. */}
            <Reveal
              index={3}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              {session ? (
                <>
                  <ButtonLink
                    href={dashboardPathFor(session.role)}
                    variant="primary"
                    size="lg"
                    arrow
                    magnetic
                  >
                    Continue to{" "}
                    {session.role === "lecturer" ? "the ledger" : "the inspector"}
                  </ButtonLink>
                  <ButtonLink href="/login" size="lg" variant="ghost">
                    Switch account
                  </ButtonLink>
                </>
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="primary"
                    size="lg"
                    arrow
                    magnetic
                  >
                    Start a verification
                  </ButtonLink>
                  <ButtonLink href="#interactive-demo" size="lg" variant="secondary">
                    Read a specimen
                  </ButtonLink>
                </>
              )}
            </Reveal>
          </div>

          {/* The evidence slip. A physical artefact from the file, sitting
              slightly off-square until you touch it. */}
          <Reveal index={2} className="lg:col-span-5">
            {/* The off-square tilt is a desktop conceit: a phone has no hover to
                straighten it, and at 320px the rotated corners push the card's
                own content past the screen edge. */}
            <motion.div
              initial={false}
              whileHover={reduced || narrow ? {} : { rotate: 0, y: -6 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              style={{ rotate: reduced || narrow ? 0 : -1.1 }}
              className="relative overflow-hidden rounded-lg border border-line bg-surface shadow-lift"
            >
              <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface-2/60 px-4 py-3">
                <span className="t-mark text-ink-2">Specimen · live read</span>
                <span className="flex items-center gap-1.5">
                  <span className="blink h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="t-mark text-[0.5625rem] text-accent-deep">
                    Reading
                  </span>
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-well">
                <Image
                  src="/imvs_hero.jpeg"
                  alt="A geological field specimen photographed for coursework assessment"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <ForensicScan active color="green" />
                <span className="absolute bottom-2 left-2 rounded-sm bg-black/55 px-1.5 py-1 backdrop-blur-sm">
                  <span className="t-mark text-[0.5625rem] text-white">
                    GLY 304 · CORE 04
                  </span>
                </span>
              </div>

              <dl className="ruled px-4">
                {[
                  { label: "Captured", value: "24 Feb 2026 · 14:18 WAT" },
                  { label: "Coordinates", value: "6.24831° N, 7.11472° E" },
                  { label: "Device", value: "Sony ILCE-7M4" },
                ].map((row) => (
                  <div
                    key={row.label}
                    /* Stacked on a phone: a mono value like the coordinate pair
                       needs the whole column, and squeezing it opposite its
                       label just truncates the evidence. */
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="t-mark shrink-0 text-ink-3">{row.label}</dt>
                    <dd className="t-num text-[0.8125rem] text-ink sm:truncate">
                      {row.value}
                    </dd>
                  </div>
                ))}
                <div className="py-3">
                  <dt className="t-mark text-ink-3">SHA-256</dt>
                  <dd className="mt-1.5">
                    <CryptographicStream hash={SPECIMENS.authentic.hash} />
                  </dd>
                </div>
              </dl>

              <div className="flex items-center justify-between border-t border-rule bg-good-wash px-4 py-3">
                <span className="t-mark text-good">Verdict</span>
                <span className="t-mark flex items-center gap-1.5 text-good">
                  <Check size={13} strokeWidth={2.6} />
                  Verified — four of four
                </span>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* Four facts on a rule, not four boxes. */}
        <Reveal index={4} className="mt-16">
          <div className="rule-quad border-y border-rule">
            {[
              { figure: "0", label: "images uploaded", note: "Analysis is local" },
              { figure: "4", label: "objective checks", note: "Per submission" },
              { figure: "256", label: "bit digest", note: "Rename-proof" },
              { figure: "1", label: "shared ledger", note: "Across all students" },
            ].map((fact) => (
              <div key={fact.label}>
                <p className="t-num text-[1.75rem] leading-none text-ink">
                  {fact.figure}
                </p>
                <p className="t-footnote mt-2 font-medium text-ink">{fact.label}</p>
                <p className="t-mark mt-1 text-[0.5625rem] text-ink-3">
                  {fact.note}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Field>

      {/* =========================================================== 02 METHOD */}
      <Field id="method" tone="ink" bleed pad="none" className="scroll-mt-28">
        {/* The band opens with a kinetic ledger strip: the vocabulary of the
            system, moving, before the system is explained. */}
        <div className="border-b border-rule py-5">
          <Marquee duration={52}>
            {LEDGER_STRIP.map((item) => (
              <span key={item} className="flex items-center gap-6 pr-6">
                <span className="t-mark text-ink-2">{item}</span>
                <span className="h-1 w-1 rotate-45 bg-accent" />
              </span>
            ))}
          </Marquee>
        </div>

        {/* Only the stamp line here, deliberately: the deck below pins its own
            title to the viewport as it plays, and a second heading in normal
            flow would say the same thing twice, ten pixels apart. */}
        <div className="bleed-inner pt-20 sm:pt-28">
          <div className="flex items-center gap-4">
            <span className="t-mark text-accent">02</span>
            <span className="t-mark text-ink-2">Method</span>
            <span className="h-px flex-1 bg-rule" />
            <span className="t-mark hidden text-ink-3 sm:block">
              Three provable facts
            </span>
          </div>
          <p className="t-body mt-6 max-w-lg text-pretty text-ink-2">
            The image is the claim. The metadata underneath it is the evidence.
            Scrolling separates one from the other.
          </p>
        </div>

        {/* The user's scroll-split deck, kept exactly as built and given a dark
            field to sit on so the flip reads with real contrast. */}
        <ScrollSplitCard
          imageSrc="/imvs_hero.jpeg"
          cards={SPLIT_CARDS}
          eyebrow="Forensic architecture"
          heading="One photograph, taken apart"
          endingText="Cryptographically audited evidence: zero subjective guesswork."
        />
      </Field>

      {/* ========================================================= 03 SPECIMEN */}
      <Field id="interactive-demo" pad="lg" className="scroll-mt-28">
        <Exhibit
          index="03"
          mark="Specimen"
          title="The same lab. Two files. One of them cannot prove where it came from."
          lede="Switch between an original camera file and the same subject after a messaging app has been through it."
          action={
            <div
              role="radiogroup"
              aria-label="Specimen"
              className="flex rounded-full border border-line bg-well p-1"
            >
              {(
                [
                  ["authentic", "Original"],
                  ["tampered", "Forwarded"],
                ] as const
              ).map(([key, label]) => {
                const active = specimenKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onPointerDown={() => setSpecimenKey(key)}
                    onClick={() => setSpecimenKey(key)}
                    className="relative rounded-full px-3.5 py-1.5"
                  >
                    {active ? (
                      reduced ? (
                        <span className="absolute inset-0 rounded-full bg-surface shadow-card" />
                      ) : (
                        <motion.span
                          layoutId="specimen-thumb"
                          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                          className="absolute inset-0 rounded-full bg-surface shadow-card"
                        />
                      )
                    ) : null}
                    <span
                      className={`t-mark relative z-10 ${
                        active ? "text-ink" : "text-ink-3"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          }
        />

        {/* Double bezel: a glass plate seated in a machined tray. */}
        <Reveal mode="scroll" className="mt-12">
          <div className="rounded-2xl border border-line bg-well p-2 shadow-lift sm:p-2.5">
            <div className="relative overflow-hidden rounded-[calc(1rem-0.375rem)] border border-line bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-surface-2/60 px-5 py-3.5">
                <span className="t-mark flex items-center gap-2.5 text-ink-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      verified ? "bg-good-mark" : "bg-warn-mark"
                    }`}
                  />
                  Telemetry console
                </span>
                <span className="t-num text-[0.75rem] text-ink-3">
                  {specimen.fileName}
                </span>
              </div>

              <ForensicScan active color={verified ? "green" : "amber"} className="z-10" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={specimenKey}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-0 grid lg:grid-cols-12"
                >
                  {/* Verdict column */}
                  <div className="flex flex-col justify-between gap-8 border-b border-rule p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
                    <div>
                      <span
                        className={`t-mark inline-flex items-center gap-1.5 rounded-sm px-2 py-1 ring-1 ring-inset ${
                          verified
                            ? "bg-good-wash text-good ring-good/25"
                            : "bg-warn-wash text-warn ring-warn/25"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            verified ? "bg-good-mark" : "bg-warn-mark"
                          }`}
                        />
                        {specimen.status}
                      </span>

                      <h3 className="t-title-2 mt-4 text-ink">{specimen.title}</h3>
                      <p className="t-footnote mt-2.5 text-ink-2">
                        {specimen.reason}
                      </p>
                    </div>

                    <div>
                      <p className="t-mark text-ink-3">Verification matrix</p>
                      <ul className="ruled mt-2 border-t border-rule">
                        {[
                          { label: "Capture time", pass: specimen.checks.time === "Pass" },
                          { label: "GPS location", pass: specimen.checks.location === "Pass" },
                          { label: "Device EXIF", pass: specimen.checks.device === "Pass" },
                          { label: "Duplicate check", pass: specimen.checks.duplicate === "Pass" },
                        ].map((item) => (
                          <li
                            key={item.label}
                            className="flex items-center justify-between py-2.5"
                          >
                            <span className="t-footnote text-ink-2">
                              {item.label}
                            </span>
                            <span
                              className={`t-mark inline-flex items-center gap-1 ${
                                item.pass ? "text-good" : "text-bad"
                              }`}
                            >
                              {item.pass ? (
                                <Check size={12} strokeWidth={2.6} />
                              ) : (
                                <Alert size={12} strokeWidth={2.4} />
                              )}
                              {item.pass ? "Pass" : "Fail"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Telemetry column */}
                  <div className="flex flex-col justify-between p-6 lg:col-span-7">
                    <div>
                      <p className="t-mark text-ink-3">Extracted EXIF telemetry</p>
                      <dl className="ruled mt-2 border-t border-rule">
                        <div className="flex items-start justify-between gap-6 py-3.5">
                          <dt className="t-footnote flex shrink-0 items-center gap-2 text-ink-2">
                            <Clock size={14} className="text-ink-3" />
                            Capture timestamp
                          </dt>
                          <dd className="t-num text-right text-[0.8125rem] text-ink">
                            {specimen.captureTime}
                          </dd>
                        </div>

                        <div className="flex items-start justify-between gap-6 py-3.5">
                          <dt className="t-footnote flex shrink-0 items-center gap-2 text-ink-2">
                            <Pin size={14} className="text-ink-3" />
                            Resolved place
                          </dt>
                          <dd className="text-right">
                            <span className="t-footnote block text-ink">
                              {specimen.location}
                            </span>
                            <span className="t-num block text-[0.75rem] text-ink-3">
                              {specimen.coordinates}
                            </span>
                          </dd>
                        </div>

                        <div className="flex items-start justify-between gap-6 py-3.5">
                          <dt className="t-footnote flex shrink-0 items-center gap-2 text-ink-2">
                            <Camera size={14} className="text-ink-3" />
                            Hardware signature
                          </dt>
                          <dd className="t-num text-right text-[0.8125rem] text-ink">
                            {specimen.device}
                          </dd>
                        </div>

                        <div className="py-3.5">
                          <dt className="t-footnote flex items-center gap-2 text-ink-2">
                            <Copies size={14} className="text-ink-3" />
                            SHA-256 binary digest
                          </dt>
                          <dd className="mt-2">
                            <CryptographicStream hash={specimen.hash} />
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3.5">
                      <p className="t-mark text-ink-3">
                        Computed in-browser · WebCrypto
                      </p>
                      <span className="t-mark flex items-center gap-1.5 text-accent-deep">
                        <ShieldCheck size={13} />
                        Cryptographically audited
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Field>

      {/* =========================================================== 04 CHECKS */}
      <Field id="checks" pad="lg" className="scroll-mt-28">
        <Exhibit
          index="04"
          mark="Checks"
          meta="Four rules"
          title="Four objective readings, taken in the order a reviewer would ask for them."
          lede="Each one is a question about the file that has a factual answer, and each answer is recorded rather than judged."
        />

        {/* A ledger, not a card grid: rows on rules, with the accent bleeding
            into the margin as the row is read. */}
        <div className="ruled mt-14 border-y border-rule">
          {CHECKS.map((check, index) => {
            const Glyph = check.icon;
            return (
              <Reveal key={check.title} mode="scroll" index={index}>
                <article className="group relative grid gap-4 py-8 lg:grid-cols-12 lg:gap-8">
                  {/* The wipe runs past the reading column into the page
                      margin, which is what makes the row feel like part of a
                      larger document rather than a self-contained tile. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-4 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 lg:-left-8"
                  />

                  <div className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-5">
                    <span className="t-num text-[2.5rem] leading-none text-ink-3 transition-colors duration-300 group-hover:text-accent">
                      {check.index}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-well text-ink-2 ring-1 ring-line transition-colors duration-300 group-hover:bg-accent-wash group-hover:text-accent-deep group-hover:ring-accent-edge">
                      <Glyph size={19} />
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="t-title-2 text-ink">{check.title}</h3>
                    <p className="t-mark mt-2 text-accent-deep">{check.subtitle}</p>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="t-callout text-pretty text-ink-2">
                      {check.description}
                    </p>
                    <p className="t-num mt-4 text-[0.75rem] text-ink-3">
                      <span className="text-ink-3/70">tags → </span>
                      {check.signal}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Field>

      {/* ===================================================== 05 ARCHITECTURE
          The colour moment. The section does not merely use vermilion — it is
          vermilion, edge to edge, and every component inside re-reads its
          palette from the band. */}
      <Field id="architecture" tone="accent" bleed pad="lg" className="scroll-mt-28">
        <div className="bleed-inner grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4">
              <span className="t-mark text-ink">File 05</span>
              <span className="t-mark text-ink-2">Privacy by architecture</span>
            </div>

            <h2 className="t-headline mt-8 text-balance text-ink">
              No image ever leaves the device.
            </h2>

            <p className="t-body mt-7 max-w-lg text-pretty text-ink-2">
              Coursework photographs carry research specimens, unpublished lab
              setups and the faces of the people who did the work. So the file
              stays where it was taken. Parsing and hashing run in the browser
              through <code className="t-num text-ink">exifr</code> and{" "}
              <code className="t-num text-ink">crypto.subtle.digest</code>; what
              is filed is the reading, not the photograph.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/privacy" variant="primary" size="md" arrow>
                Read the data policy
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="md">
                Try it on your own photo
              </ButtonLink>
            </div>

            <p className="t-footnote mt-10 max-w-md text-pretty text-ink-2">
              The server is still authoritative for verdicts — only it can see
              every student&apos;s digests. That limitation is documented, not
              hidden.
            </p>
          </div>

          {/* The pipeline as a numbered sequence on rules, inverted. */}
          <ol className="ruled border-y border-rule lg:col-span-6">
            {PIPELINE.map((stage) => (
              <li
                key={stage.step}
                className="group flex items-start gap-5 py-5 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-2"
              >
                <span className="t-num shrink-0 text-[1.5rem] leading-none text-ink-3 transition-colors duration-300 group-hover:text-ink">
                  {stage.step}
                </span>
                <div>
                  <p className="t-title-3 text-ink">{stage.title}</p>
                  <p className="t-footnote mt-1 text-ink-2">{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Field>

      {/* ============================================================ 06 CASES */}
      <Field id="case-studies" pad="lg" className="scroll-mt-28">
        <Exhibit
          index="06"
          mark="Cases"
          title="Where the ledger has already been run."
          lede="Fieldwork, laboratory practicals and industrial training, audited across the Faculty of Physical Sciences."
          action={
            <Link
              href="/case-studies"
              className="t-mark group -my-3 inline-flex min-h-11 items-center gap-2 py-3 text-accent-deep"
            >
              All cases
              <ArrowRight
                size={13}
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </Link>
          }
        />

        {/* Deliberately not three equal cards: one lead study takes the width
            of a spread, the other two run beside it as a stacked column. */}
        <div className="mt-14 grid auto-rows-min grid-flow-dense gap-4 lg:grid-cols-12">
          {CASE_STUDIES.map((study, index) => (
            <Reveal
              key={study.title}
              mode="scroll"
              index={index}
              className={index === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}
            >
              <Link
                href="/case-studies"
                className={`group flex h-full flex-col justify-between overflow-hidden rounded-lg border border-line bg-surface p-6 shadow-card transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-edge hover:shadow-lift ${
                  index === 0 ? "lg:p-9" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="t-mark text-accent-deep">{study.tag}</span>
                    <span className="t-num text-[0.75rem] text-ink-3">
                      {study.course}
                    </span>
                  </div>

                  <h3
                    className={`mt-5 text-balance text-ink ${
                      index === 0 ? "t-title-1" : "t-title-3"
                    }`}
                  >
                    {study.title}
                  </h3>
                  <p className="t-footnote mt-3 max-w-md text-ink-2">
                    {study.result}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-4">
                  <div>
                    <p
                      className={`t-num leading-none text-accent-deep ${
                        index === 0 ? "text-[3rem]" : "text-[1.75rem]"
                      }`}
                    >
                      {study.figure}
                    </p>
                    <p className="t-mark mt-2 text-ink-3">{study.figureLabel}</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-well text-ink-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-accent group-hover:text-accent-ink">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Field>

      {/* ============================================================= 07 TEAM */}
      <Field id="team" tone="ink" bleed pad="lg" className="scroll-mt-28">
        <div className="bleed-inner">
          <Exhibit
            index="07"
            mark="Attribution"
            title="Built at Nnamdi Azikiwe University, and supervised there too."
            lede="A final-year research project, reviewed by the faculty that runs the assessments it audits."
          />

          {/* Staggered, gallery-style: labels sit outside the frame, and the
              column heights alternate so the row never reads as three tiles. */}
          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
            {TEAM.map((member, index) => (
              <Reveal
                key={member.name}
                mode="scroll"
                index={index}
                className={index === 1 ? "md:mt-16" : index === 2 ? "md:mt-8" : ""}
              >
                <figure className="group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-surface-2">
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role}, ${member.affiliation}`}
                      fill
                      className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-sm bg-black/45 px-2 py-1 backdrop-blur-sm">
                      <span className="t-mark text-[0.5625rem] text-white">
                        {member.badge}
                      </span>
                    </span>
                  </div>

                  <figcaption className="mt-5">
                    <div className="flex items-baseline gap-3">
                      <span className="t-num text-[0.75rem] text-ink-3">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="t-title-3 text-ink">{member.name}</h3>
                    </div>
                    <p className="t-mark mt-2 text-accent">{member.role}</p>
                    <p className="t-caption mt-1.5 text-ink-3">
                      {member.affiliation}
                    </p>
                    <p className="t-footnote mt-3 text-ink-2">{member.bio}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Field>

      {/* ======================================================== 08 QUESTIONS */}
      <Field id="faq" pad="lg" className="scroll-mt-28">
        <Exhibit
          index="08"
          mark="Questions"
          title="What people ask before they trust it."
          lede="Local-first parsing, stripped metadata, duplicate detection and what happens to the photograph itself."
        />

        <div className="ruled mt-14 border-y border-rule">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-5 py-6 text-left lg:gap-8"
                >
                  <span
                    className={`t-num shrink-0 pt-1 text-[0.8125rem] transition-colors duration-300 ${
                      isOpen ? "text-accent" : "text-ink-3"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`t-title-2 flex-1 text-balance transition-colors duration-300 ${
                      isOpen ? "text-accent-deep" : "text-ink group-hover:text-accent-deep"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen
                        ? "bg-accent text-accent-ink"
                        : "bg-well text-ink-2 group-hover:bg-accent-wash"
                    }`}
                  >
                    <ChevronDown size={15} strokeWidth={2.2} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="t-callout max-w-2xl pb-7 text-pretty text-ink-2 lg:ml-[3.25rem]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Field>

      {/* ============================================================ 09 ANCHOR */}
      <Field id="location" pad="lg" className="scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="t-mark text-accent-deep">File 09</span>
              <span className="t-mark text-ink-2">Institutional anchor</span>
            </div>

            <h2 className="t-title-1 mt-7 text-balance text-ink">
              Faculty of Physical Sciences, UNIZIK Awka
            </h2>

            <dl className="ruled mt-8 border-y border-rule">
              <div className="flex items-start gap-4 py-4">
                <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="t-mark text-ink-3">Campus address</dt>
                  <dd className="t-footnote mt-1.5 text-ink">
                    Faculty of Physical Sciences Building, Nnamdi Azikiwe
                    University, PMB 5025, Awka, Anambra State.
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4">
                <span className="mt-0.5 shrink-0">
                  <RadarPing size={17} />
                </span>
                <div>
                  <dt className="t-mark text-ink-3">GPS reference datum</dt>
                  <dd className="t-num mt-1.5 text-[0.8125rem] text-ink">
                    6.24831° N, 7.11472° E · 112 m ASL
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="https://maps.google.com/?q=6.24831,7.11472"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
              >
                Open in Maps
                <ArrowUpRight size={14} />
              </ButtonLink>
            </div>
          </div>

          {/* A survey plot rather than a stock map graphic. */}
          <Reveal mode="scroll" className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg border border-line bg-well">
              <div className="grid-paper absolute inset-0 opacity-70" />

              <div className="relative flex min-h-[22rem] flex-col justify-between p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="t-mark text-ink-3">Geofence · active</span>
                  <span className="t-num text-[0.6875rem] text-ink-3">
                    ZONE 01 / FPS
                  </span>
                </div>

                <div className="relative self-center">
                  {/* Crosshair on the datum. */}
                  <span className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-accent-edge" />
                  <span className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-accent-edge" />
                  <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-edge" />
                  <span className="drift relative flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-ink shadow-accent">
                    <BrandMark size={24} />
                  </span>
                </div>

                <div className="ruled-x grid grid-cols-3 border-t border-rule pt-4">
                  {[
                    ["Physics", "PHY"],
                    ["Geology", "GLY"],
                    ["Chemistry", "ICH"],
                  ].map(([name, code]) => (
                    <div key={code} className="px-3 first:pl-0">
                      <p className="t-footnote font-medium text-ink">{name}</p>
                      <p className="t-num mt-1 text-[0.6875rem] text-ink-3">
                        {code}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Field>

      {/* ============================================================== CLOSING */}
      <Field tone="accent" bleed pad="lg">
        <div className="bleed-inner flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="t-mark text-ink-2">Ready to file</span>
            <h2 className="t-headline mt-6 max-w-2xl text-balance text-ink">
              Start with one photograph. See what it can actually prove.
            </h2>
            <p className="t-body mt-5 max-w-lg text-ink-2">
              A verdict in under a tenth of a second, computed on your own
              device, with nothing transmitted but the reading.
            </p>
          </div>

          <ButtonLink
            href="/login"
            variant="primary"
            size="lg"
            arrow
            magnetic
            className="shrink-0"
          >
            Launch Provenance
          </ButtonLink>
        </div>
      </Field>

      {/* =============================================================== FOOTER */}
      <Field tone="ink" bleed pad="none" as="footer">
        <div className="bleed-inner py-16">
          <div className="grid gap-10 border-b border-rule pb-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-ink">
                <BrandMark size={26} />
                <span className="t-mark text-ink">Provenance</span>
              </div>
              <p className="t-footnote max-w-xs text-ink-2">
                Browser-native image provenance and metadata auditing for
                academic practical, laboratory, fieldwork and SIWES assessment.
              </p>
              <p className="t-mark text-ink-3">EST. 2026 · UNIZIK AWKA</p>
            </div>

            {[
              {
                heading: "Platform",
                links: [
                  { label: "Student inspector", href: "/student" },
                  { label: "Lecturer ledger", href: "/lecturer" },
                  { label: "Case studies", href: "/case-studies" },
                  { label: "Specimen demo", href: "/#interactive-demo" },
                  { label: "Sign in", href: "/login" },
                ],
              },
              {
                heading: "Standards",
                links: [
                  { label: "Privacy & security", href: "/privacy" },
                  { label: "Sitemap", href: "/sitemap.xml" },
                  { label: "Robots", href: "/robots.txt" },
                ],
              },
            ].map((column) => (
              <div key={column.heading}>
                <p className="t-mark text-ink-3">{column.heading}</p>
                <ul className="ruled mt-4 border-t border-rule">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="t-footnote group flex items-center justify-between py-2.5 text-ink-2 transition-colors hover:text-ink"
                      >
                        {link.label}
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 transition-opacity group-hover:opacity-60"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="t-mark text-ink-3">Contact</p>
              <div className="mt-4 space-y-2 border-t border-rule pt-4">
                <p className="t-footnote font-semibold text-ink">
                  Faculty of Physical Sciences
                </p>
                <p className="t-footnote text-ink-2">
                  Nnamdi Azikiwe University, Awka, Anambra State, Nigeria.
                </p>
                <p className="t-num text-[0.75rem] text-ink-3">
                  provenance@unizik.edu.ng
                </p>
                <p className="t-num text-[0.6875rem] text-ink-3">
                  6.24831° N, 7.11472° E
                </p>
              </div>
            </div>
          </div>

          {/* The wordmark as a rule of its own, set in outlined display type. */}
          <p
            aria-hidden
            className="numeral-ghost mt-12 select-none text-[clamp(3rem,13vw,10rem)] tracking-[-0.04em]"
          >
            PROVENANCE
          </p>

          <div className="mt-8 flex flex-col justify-between items-start gap-3 sm:flex-row sm:items-center">
            <p className="t-mark text-ink-3">
              © 2026 · Final year thesis · Ebube Ezedimbu
            </p>
            <p className="t-mark text-ink-3">
              Last updated: September 2026 · Active Release v2.4.0
            </p>
            <p className="t-mark text-ink-3">
              Faculty of Physical Sciences, UNIZIK
            </p>
          </div>
        </div>
      </Field>
    </PageShell>
  );
}
