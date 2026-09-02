import PageShell from "../../components/PageShell";
import Field from "../../components/ui/Field";
import Exhibit from "../../components/ui/Exhibit";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ButtonLink } from "../../components/ui/Button";
import { Doc, Mail, MapPin, ShieldCheck, Zap } from "../../components/ui/icons";

export const metadata = {
  title: "Privacy Policy & Zero-Upload Security Guarantee",
  description:
    "Learn how Provenance protects student privacy and research intellectual property through client-side WebAssembly EXIF parsing, local SHA-256 hashing, and zero raw photo uploads.",
  alternates: {
    canonical: "https://provenance-unizik.edu.ng/privacy",
  },
};

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Zero raw uploads",
    detail: "The full-resolution camera file never leaves the browser buffer.",
  },
  {
    icon: Zap,
    title: "Local hashing",
    detail: "SHA-256 digests are computed on the device through WebCrypto.",
  },
  {
    icon: Doc,
    title: "NDPR aligned",
    detail: "Built against NDPR and academic records retention frameworks.",
  },
];

const SECTIONS = [
  {
    id: "processing",
    index: "01",
    title: "Client-side processing and execution model",
    body: [
      "All binary parsing of EXIF tags, GPS coordinates, sensor hardware signatures and capture timestamps executes on the client device, through native web APIs and the compiled exifr parser.",
      "The application does not stream, transmit or cache full-resolution photograph binaries to external servers, AI models, or third-party analysis services.",
    ],
  },
  {
    id: "persisted",
    index: "02",
    title: "What is transmitted, and what is kept",
    body: [
      "So that lecturers and laboratory supervisors can audit practical coursework, only the derived verification record is persisted to the institutional ledger:",
    ],
    list: [
      {
        term: "SHA-256 digest",
        detail:
          "A one-way fingerprint of the file's bytes, used solely to detect duplicate submissions across students.",
      },
      {
        term: "Telemetry summary",
        detail:
          "Capture timestamp, resolved latitude and longitude, camera make and model, and the pass or fail of each check.",
      },
      {
        term: "Thumbnail, 96px or smaller",
        detail:
          "A heavily downscaled visual reference, kept strictly so a reviewer can confirm the specimen's subject.",
      },
      {
        term: "Submission metadata",
        detail:
          "Student name, registration number, course code and the time the record was filed.",
      },
    ],
  },
  {
    id: "location",
    index: "03",
    title: "Geospatial telemetry and location privacy",
    body: [
      "Where an image carries embedded GPS coordinates, those coordinates are resolved to a human-readable place name through OpenStreetMap Nominatim — for example, “UNIZIK Faculty of Physical Sciences, Awka”. This happens once, for one photograph, at the moment it is checked.",
      "There is no continuous or background location tracking of the user or their device at any point.",
    ],
  },
  {
    id: "retention",
    index: "04",
    title: "Academic integrity and record retention",
    body: [
      "Verification records are retained through the active academic session for grading, moderation and accreditation review.",
      "Under the Nigeria Data Protection Regulation, students may request review of a flagged entry through their departmental head or course lecturer.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell stamp="Provenance — Data Policy">
      <Field pad="none" className="pt-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]}
        />
      </Field>

      <Field pad="md">
        <Exhibit
          mark="Data policy"
          meta="Effective Sept 2026"
          title="Academic verification should not cost anyone their privacy."
          lede="What the system reads, where it reads it, and the small derived record that is all it keeps."
        />

        <div className="rule-trio mt-12 border-y border-rule">
          {GUARANTEES.map((item) => {
            const Glyph = item.icon;
            return (
              <div key={item.title}>
                <Glyph size={18} className="text-accent" />
                <p className="t-title-3 mt-3.5 text-ink">{item.title}</p>
                <p className="t-footnote mt-1.5 text-pretty text-ink-2">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </Field>

      <Field pad="md">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Contents, held in the margin. A policy is a document, and a
              document this long earns a spine you can navigate from. */}
          <nav
            aria-label="Sections"
            className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start"
          >
            <p className="t-mark text-ink-3">Contents</p>
            <ol className="ruled mt-3 border-t border-rule">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex items-baseline gap-3 py-2.5"
                  >
                    <span className="t-num text-[0.6875rem] text-ink-3">
                      {section.index}
                    </span>
                    <span className="t-footnote text-ink-2 transition-colors group-hover:text-accent-deep">
                      {section.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="ruled border-t border-rule lg:col-span-9">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 py-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="t-num text-[0.8125rem] text-accent">
                    {section.index}
                  </span>
                  <h2 className="t-title-2 text-balance text-ink">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-5 space-y-4 lg:ml-[2.5rem]">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="t-callout max-w-2xl text-pretty text-ink-2"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.list ? (
                    <dl className="ruled mt-6 max-w-2xl border-y border-rule">
                      {section.list.map((item) => (
                        <div key={item.term} className="py-3.5">
                          <dt className="t-footnote font-semibold text-ink">
                            {item.term}
                          </dt>
                          <dd className="t-footnote mt-1 text-pretty text-ink-2">
                            {item.detail}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </section>
            ))}
          </article>
        </div>
      </Field>

      <Field tone="ink" bleed pad="md">
        <div className="bleed-inner">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="t-mark text-ink-3">05 · Contact</p>
              <h2 className="t-title-1 mt-4 text-balance text-ink">
                Questions about how a record was handled?
              </h2>
              <p className="t-callout mt-4 max-w-md text-ink-2">
                Reach the project and faculty administration team directly.
              </p>
            </div>

            <dl className="ruled border-y border-rule lg:col-span-7">
              <div className="flex items-start gap-4 py-4">
                <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="t-mark text-ink-3">Address</dt>
                  <dd className="t-footnote mt-1.5 text-ink">
                    Faculty of Physical Sciences, Nnamdi Azikiwe University,
                    Awka, Anambra State.
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-4">
                <Mail size={17} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="t-mark text-ink-3">Email</dt>
                  <dd className="t-num mt-1.5 text-[0.8125rem] text-ink">
                    provenance@unizik.edu.ng
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
            <ButtonLink href="/" size="md" variant="secondary">
              Back to the file
            </ButtonLink>
            <ButtonLink href="/login" variant="primary" size="md" arrow>
              Launch the inspector
            </ButtonLink>
          </div>
        </div>
      </Field>
    </PageShell>
  );
}
