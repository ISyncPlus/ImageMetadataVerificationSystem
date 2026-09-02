import PageShell from "../../components/PageShell";
import Reveal from "../../components/ui/Reveal";
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
  title: "Academic Case Studies — UNIZIK Physical Sciences",
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

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <div className="py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Case Studies" },
          ]}
        />
      </div>

      {/* Header */}
      <section className="py-6 sm:py-10 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-card">
            <GraduationCap size={16} className="text-accent" />
            <span className="t-caption font-medium text-ink">
              Faculty of Physical Sciences · Field &amp; Lab Audits
            </span>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h1 className="t-display mx-auto mt-4 max-w-3xl text-balance text-ink font-bold tracking-tight">
            Academic Provenance Case Studies
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="t-body mx-auto mt-3 max-w-2xl text-pretty text-ink-2">
            See how the four-pillar verification engine replaces manual visual guesswork
            with mathematical EXIF telemetry across laboratory, fieldwork, and industrial training courses.
          </p>
        </Reveal>
      </section>

      {/* Case Studies List */}
      <div className="space-y-12 pb-12">
        {CASE_STUDIES.map((study, idx) => (
          <Reveal key={study.id} index={idx}>
            <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              {/* Top Banner */}
              <div className="border-b border-line bg-surface-2 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <span className="t-caption font-bold uppercase tracking-wider text-accent">
                  {study.tag}
                </span>
                <span className="t-caption rounded-full border border-line bg-surface px-3 py-1 font-medium text-ink-2">
                  {study.course}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="t-title-1 font-bold text-ink">{study.title}</h2>
                  <p className="t-caption mt-1.5 flex items-center gap-1.5 text-ink-3">
                    <MapPin size={14} className="text-accent shrink-0" />
                    {study.location}
                  </p>
                </div>

                {/* Problem vs Solution */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-line bg-bad-wash/30 p-5">
                    <p className="t-caption font-semibold uppercase tracking-wider text-bad flex items-center gap-1.5">
                      <ShieldAlert size={14} /> The Academic Integrity Challenge
                    </p>
                    <p className="t-footnote mt-2 text-ink-2 leading-relaxed">
                      {study.problem}
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-good-wash/30 p-5">
                    <p className="t-caption font-semibold uppercase tracking-wider text-good flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Provenance Telemetry Solution
                    </p>
                    <p className="t-footnote mt-2 text-ink-2 leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-line bg-well p-4 text-center">
                  {study.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p className="t-title-2 font-bold text-ink">{metric.value}</p>
                      <p className="t-caption text-ink-3 mt-0.5">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Specimen Telemetry Comparison Grid */}
                <div className="rounded-xl border border-line bg-surface-2 p-5">
                  <p className="t-caption font-semibold uppercase tracking-wider text-ink-3 mb-4">
                    Audit Log Specimen Comparison
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Authentic specimen */}
                    <div className="rounded-lg border border-line bg-surface p-4">
                      <div className="flex items-center justify-between">
                        <span className="t-caption inline-flex items-center gap-1 font-bold text-good">
                          <Check size={14} /> VERIFIED SPECIMEN
                        </span>
                        <span className="t-caption font-mono text-ink-3">
                          {study.specimenData.authentic.file}
                        </span>
                      </div>
                      <dl className="mt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Time:</dt>
                          <dd className="font-semibold text-ink">{study.specimenData.authentic.time}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Location:</dt>
                          <dd className="font-semibold text-ink">{study.specimenData.authentic.location}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Sensor:</dt>
                          <dd className="font-semibold text-ink">{study.specimenData.authentic.device}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Tampered specimen */}
                    <div className="rounded-lg border border-line bg-surface p-4">
                      <div className="flex items-center justify-between">
                        <span className="t-caption inline-flex items-center gap-1 font-bold text-bad">
                          <Alert size={14} /> SUSPICIOUS SPECIMEN
                        </span>
                        <span className="t-caption font-mono text-ink-3">
                          {study.specimenData.tampered.file}
                        </span>
                      </div>
                      <dl className="mt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Time:</dt>
                          <dd className="font-semibold text-bad">{study.specimenData.tampered.time}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Location:</dt>
                          <dd className="font-semibold text-bad">{study.specimenData.tampered.location}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-ink-3">Sensor:</dt>
                          <dd className="font-semibold text-bad">{study.specimenData.tampered.device}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* CTA Footer */}
      <Reveal className="pb-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-8 text-center shadow-card sm:flex-row sm:text-left">
          <div>
            <h3 className="t-title-2 font-bold text-ink">
              Ready to verify your coursework photographs?
            </h3>
            <p className="t-footnote text-ink-2 mt-1">
              Test your JPEG and PNG files locally in under 50 milliseconds with zero server uploads.
            </p>
          </div>
          <ButtonLink href="/login" variant="primary" size="lg" className="shrink-0">
            Start Verification &rarr;
          </ButtonLink>
        </div>
      </Reveal>
    </PageShell>
  );
}
