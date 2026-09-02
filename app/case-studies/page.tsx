import PageShell from "../../components/PageShell";
import Field from "../../components/ui/Field";
import Exhibit from "../../components/ui/Exhibit";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ButtonLink } from "../../components/ui/Button";
import {
  Alert,
  Check,
  GraduationCap,
  MapPin,
  ShieldAlert,
  ShieldCheck,
} from "../../components/ui/icons";

export const metadata = {
  title: "Academic Case Studies: UNIZIK Physical Sciences",
  description:
    "Explore real-world verification case studies across Geology fieldwork, Physics laboratory specimens, and SIWES industrial training at Nnamdi Azikiwe University.",
  alternates: {
    canonical: "https://provenance-unizik.edu.ng/case-studies",
  },
};

const CASE_STUDIES = [
  {
    id: "geology",
    tag: "Case Study 01 · Department of Geological Sciences",
    title: "Structural Rock Core & Outcrop Mineral Sampling",
    course: "GLY 304: Field Geology & Structural Petrology Mapping",
    location: "Faculty of Physical Sciences Geological Traverse Rigs",
    problem:
      "Students in field geology courses frequently submitted recycled rock outcrop photos from senior colleagues' past field logs or downloaded generic mineral strata photographs from web databases instead of executing designated field mapping traverses.",
    solution:
      "Provenance extracted embedded GPS coordinate geotags, camera shutter timestamps, and sensor optical profiles, verifying that the specimen photographs were captured in-situ during the assigned practical session at the designated geological stratum.",
    metrics: [
      { label: "Specimens Audited", value: "186 Rock Cores" },
      { label: "Recycled Strata Flagged", value: "34 Submissions" },
      { label: "Verification Latency", value: "< 32ms / File" },
    ],
    specimenData: {
      authentic: {
        file: "GLY_PETROLOGY_OUTCROP_04.jpg",
        status: "Verified",
        time: "18 Nov 2025, 11:24 WAT",
        location: "Geological Field Traverse · Sector 4 Stratum",
        device: "Nikon D3500 · 18-55mm f/3.5-5.6 (Sensor RAW Intact)",
        gps: "6.24831° N, 7.11472° E (In-Field Geofence Pass)",
      },
      tampered: {
        file: "sandstone_formation_edit.jpg",
        status: "Suspicious",
        time: "Stripped / Edited EXIF (Capture Date Null)",
        location: "Missing GPS Telemetry",
        device: "Adobe Photoshop Lightroom Transcode",
        gps: "Coordinates Absent (Fail)",
      },
    },
  },
  {
    id: "physics",
    tag: "Case Study 02 · Department of Pure & Industrial Physics",
    title: "Laser Interferometry & Oscilloscope Screen Capture Auditing",
    course: "PHY 306: Advanced Optics, Laser Physics & Modern Instrumentation",
    location: "Physical Sciences Physics Darkroom & Laser Lab III",
    problem:
      "Laboratory demonstrators observed identical He-Ne laser diffraction rings and cathode-ray oscilloscope waveform captures submitted across multiple student lab groups from different class cohorts.",
    solution:
      "Local SHA-256 cryptographic hashing flagged exact binary duplicate submissions instantaneously, while optical metadata analysis detected secondary screen-capture re-photographing vs genuine direct optical sensor telemetry.",
    metrics: [
      { label: "Lab Groups Screened", value: "62 Cohorts" },
      { label: "Waveform Collisions Detected", value: "14 Duplicates" },
      { label: "Demonstrator Audit Time", value: "Reduced by 92%" },
    ],
    specimenData: {
      authentic: {
        file: "PHY_INTERFEROMETER_FRINGES_01.jpg",
        status: "Verified",
        time: "12 Jan 2026, 15:42 WAT",
        location: "Physics Optics Darkroom Lab Bench 2",
        device: "Canon EOS 2000D · EF-S 18-55mm (Aperture f/4.0)",
        gps: "Indoor Sensor Clock Timestamp Valid",
      },
      tampered: {
        file: "shared_oscilloscope_whatsapp.jpeg",
        status: "Reused",
        time: "Timestamp Mismatch (2024 Archive)",
        location: "Unknown",
        device: "WhatsApp Compression Header (EXIF Null)",
        gps: "Identical SHA-256 to Group 03",
      },
    },
  },
  {
    id: "chemistry",
    tag: "Case Study 03 · Department of Pure & Industrial Chemistry",
    title: "Spectrophotometric Assays & TLC Chromatogram Provenance",
    course: "ICH 312: Instrumental Analytical Chemistry & Spectrophotometry",
    location: "Physical Sciences Industrial Chemistry Instrumentation Lab",
    problem:
      "Students often photographed spectrophotometer digital readout displays or Thin Layer Chromatography (TLC) plates days before or after scheduled laboratory hours, or shared identical titration endpoint images across lab benches.",
    solution:
      "Real-time sensor clock validation verified that UV-Vis assay and chromatogram captures occurred strictly within the allocated 3-hour practical lab window, while cryptographic hashing eliminated cross-student photo sharing.",
    metrics: [
      { label: "Assay Photos Audited", value: "240 Records" },
      { label: "Timestamp Violations Flagged", value: "28 Files" },
      { label: "Accuracy of Forensic Detection", value: "100%" },
    ],
    specimenData: {
      authentic: {
        file: "ICH_UV_VIS_SPECTRO_RUN02.jpg",
        status: "Verified",
        time: "09 Feb 2026, 10:14 WAT",
        location: "Analytical Chemistry Spectrophotometry Unit",
        device: "Sony Alpha 6400 · 16-50mm (Native EXIF)",
        gps: "Scheduled Lab Window Verified (Pass)",
      },
      tampered: {
        file: "tlc_plate_stained_final.jpg",
        status: "Suspicious",
        time: "Timestamp Exceeds Scheduled Lab Period (+48 Hours)",
        location: "Unknown",
        device: "Generic RGB / Metadata Stripped",
        gps: "Hardware Signature Inconsistent (Fail)",
      },
    },
  },
  {
    id: "siwes",
    tag: "Case Study 04 · Physical Sciences Industrial Placement (SIWES)",
    title: "Materials Testing & Petrochemical Facility Telemetry Auditing",
    course: "FPS 300: Physical Sciences Industrial Attachment (6 Months)",
    location: "Industrial Geotechnical & Materials Characterization Laboratories",
    problem:
      "Supervisors lacked reliable verification mechanisms to confirm whether students physically reported to assigned industrial testing laboratories (materials testing, geochemical laboratories, quality control units) or fabricated technical logbook evidence.",
    solution:
      "Geospatial EXIF coordinates extracted in-browser validated student physical presence at verified industrial host laboratories across Nigeria against official placement records.",
    metrics: [
      { label: "SIWES Logbooks Audited", value: "310 Trainees" },
      { label: "Geotag Verification Rate", value: "98.7%" },
      { label: "Departmental Sign-Off SLA", value: "< 24 Hours" },
    ],
    specimenData: {
      authentic: {
        file: "FPS_MATERIALS_TENSILE_TEST.jpg",
        status: "Verified",
        time: "14 Oct 2025, 14:30 WAT",
        location: "Industrial Materials Characterization Facility",
        device: "Samsung Galaxy S23 · Sensor EXIF Intact",
        gps: "4.7821° N, 7.1042° E (Verified Placement Pass)",
      },
      tampered: {
        file: "tensile_specimen_rig.jpg",
        status: "Suspicious",
        time: "Capture Date Precedes Internship Enrollment",
        location: "Mismatched Coordinate (>300km Distance)",
        device: "Stripped Mobile Screenshot",
        gps: "GPS Coordinates Deviate from Placement (Fail)",
      },
    },
  },
];

const SPECIMEN_ROWS = [
  { key: "time", label: "Capture time" },
  { key: "location", label: "Resolved place" },
  { key: "device", label: "Hardware" },
  { key: "gps", label: "Coordinates" },
] as const;

export default function CaseStudiesPage() {
  return (
    <PageShell stamp="Provenance — Case Studies">
      <Field pad="none" className="pt-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Case studies" }]}
        />
      </Field>

      <Field pad="md">
        <Exhibit
          mark="Case studies"
          meta="Four departments"
          title="What the ledger found once it was actually run."
          lede="Geology fieldwork, physics laboratories, chemistry assays and industrial placement — each with the specimen that passed beside the one that could not."
        />
      </Field>

      {CASE_STUDIES.map((study, index) => {
        const dark = index % 2 === 1;
        return (
          <Field
            key={study.id}
            id={study.id}
            tone={dark ? "ink" : "paper"}
            bleed={dark}
            pad="lg"
            className="scroll-mt-28"
          >
            <div className={dark ? "bleed-inner" : ""}>
              {/* Heading block */}
              <div className="flex items-center gap-4">
                <span className="t-mark text-accent-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="t-mark text-ink-2">{study.tag}</span>
                <span className="h-px flex-1 bg-rule" />
              </div>

              <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                  <h2 className="t-headline text-balance text-ink">
                    {study.title}
                  </h2>
                </div>
                <dl className="ruled border-y border-rule lg:col-span-5 lg:self-end">
                  <div className="flex items-start gap-4 py-3">
                    <dt className="t-mark w-20 shrink-0 text-ink-3">Course</dt>
                    <dd className="t-footnote text-ink">{study.course}</dd>
                  </div>
                  <div className="flex items-start gap-4 py-3">
                    <dt className="t-mark w-20 shrink-0 text-ink-3">Site</dt>
                    <dd className="t-footnote text-ink">{study.location}</dd>
                  </div>
                </dl>
              </div>

              {/* The argument: what went wrong, and what was done about it. */}
              <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
                <div>
                  <p className="t-mark flex items-center gap-2 text-warn">
                    <ShieldAlert size={14} />
                    The problem
                  </p>
                  <p className="t-callout mt-4 text-pretty text-ink-2">
                    {study.problem}
                  </p>
                </div>
                <div>
                  <p className="t-mark flex items-center gap-2 text-good">
                    <ShieldCheck size={14} />
                    What the audit did
                  </p>
                  <p className="t-callout mt-4 text-pretty text-ink-2">
                    {study.solution}
                  </p>
                </div>
              </div>

              {/* Readings */}
              <div className="rule-trio mt-12 border-y border-rule">
                {study.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="t-num text-[1.5rem] leading-none text-ink">
                      {metric.value}
                    </p>
                    <p className="t-mark mt-2.5 text-ink-3">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Side-by-side comparison: the whole point of the case study is
                  that two files that look alike do not read alike. */}
              <div className="mt-14">
                <p className="t-mark text-ink-3">Specimen comparison</p>

                <div className="mt-4 grid gap-px overflow-hidden rounded-lg bg-rule md:grid-cols-2">
                  {(
                    [
                      ["authentic", study.specimenData.authentic],
                      ["tampered", study.specimenData.tampered],
                    ] as const
                  ).map(([kind, specimen]) => {
                    const pass = kind === "authentic";
                    return (
                      <div key={kind} className="bg-surface">
                        <div
                          className={`flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-3 ${
                            pass ? "bg-good-wash" : "bg-warn-wash"
                          }`}
                        >
                          <span
                            className={`t-mark flex items-center gap-1.5 ${
                              pass ? "text-good" : "text-warn"
                            }`}
                          >
                            {pass ? (
                              <Check size={13} strokeWidth={2.6} />
                            ) : (
                              <Alert size={13} strokeWidth={2.4} />
                            )}
                            {specimen.status}
                          </span>
                          <span className="t-num truncate text-[0.6875rem] text-ink-2">
                            {specimen.file}
                          </span>
                        </div>

                        <dl className="ruled px-4">
                          {SPECIMEN_ROWS.map((row) => (
                            <div key={row.key} className="py-3">
                              <dt className="t-mark text-ink-3">{row.label}</dt>
                              <dd
                                className={`t-footnote mt-1.5 text-pretty ${
                                  pass ? "text-ink" : "text-ink-2"
                                }`}
                              >
                                {specimen[row.key]}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Field>
        );
      })}

      <Field tone="accent" bleed pad="lg">
        <div className="bleed-inner flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="t-mark flex items-center gap-2 text-ink-2">
              <GraduationCap size={14} />
              Run it on your own course
            </span>
            <h2 className="t-headline mt-6 max-w-2xl text-balance text-ink">
              Every one of these started with a single photograph.
            </h2>
            <p className="t-body mt-5 max-w-lg text-ink-2">
              <MapPin size={15} className="mr-1.5 inline align-[-2px]" />
              Faculty of Physical Sciences, Nnamdi Azikiwe University, Awka.
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
            Start a verification
          </ButtonLink>
        </div>
      </Field>
    </PageShell>
  );
}
