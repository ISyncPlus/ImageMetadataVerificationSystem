# Provenance (Product Document)

## Product Summary
**Provenance** (formerly IMVS) is a web application for verifying the authenticity and provenance of student image submissions in practical coursework, laboratory experiments, fieldwork, and SIWES industrial training reports. Image analysis runs entirely in the browser; a server persists the resulting verification records so reviewers can audit submissions across the department.

## Core Problem
Academic assessment of field and laboratory work relies heavily on photographic evidence. Reviewers traditionally guess authenticity by looking at photos. Provenance replaces subjective inspection with mathematical auditing of embedded camera EXIF metadata (capture timestamps, GPS coordinates, device hardware signatures) and SHA-256 duplicate detection.

## Key Stakeholders & Roles
1. **Students**: Either capture the specimen inside Provenance, or upload an uncompressed camera image (JPEG/PNG). Receive immediate client-side verification verdicts, view extracted telemetry, and print submission certificates.
2. **Lecturers / Department Reviewers**: Audit submissions across courses, filter by status (Verified, Suspicious, Reused), inspect flagged anomalies, search by student registration number, and export class summary reports for grading archives.

## Location Evidence
Most coursework photographs arrive with no coordinates: a phone embeds GPS only while its camera app holds location permission, and messaging apps strip what does exist. Provenance therefore recognises three tiers, and never lets them blur:

- **Embedded** — read from the file's own EXIF or XMP. Counts towards the location check.
- **Witnessed** — the student captured the photograph inside Provenance, and the device position was read at the instant the shutter fired. Counts, and is the strongest evidence the system can collect: an uploaded file's metadata is whatever the file says, whereas a witnessed capture is one the application observed.
- **Attested** — the student's device position at upload. Recorded and shown to reviewers, but **never counted**: it establishes where the student was when submitting, not where the photograph was taken.

## Privacy & Architectural Guarantees
- **Client-Side Analysis**: All parsing (`exifr`) and hashing (`crypto.subtle.digest`) executes locally in the user's browser. Verification still runs offline; only persistence needs the network.
- **No Original File Leaves the Device**: The full-resolution photograph is never transmitted. What is persisted is the *derived record* — SHA-256 digest, extracted metadata values, verdict — together with a ≤96px thumbnail retained so reviewers can see what was submitted.
- **Server-Authoritative Verdicts**: The API re-derives every verdict from the submitted metadata and performs duplicate detection across all students. A client cannot assert its own result. See `ARCHITECTURE.md` for the reasoning and the limitations this leaves open.
- **Case Study Anchor**: Faculty of Physical Sciences, Nnamdi Azikiwe University (UNIZIK), Awka.
