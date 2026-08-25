# Provenance (Product Document)

## Product Summary
**Provenance** (formerly IMVS) is a client-side web application for verifying the authenticity and provenance of student image submissions in practical coursework, laboratory experiments, fieldwork, and SIWES industrial training reports.

## Core Problem
Academic assessment of field and laboratory work relies heavily on photographic evidence. Reviewers traditionally guess authenticity by looking at photos. Provenance replaces subjective inspection with mathematical auditing of embedded camera EXIF metadata (capture timestamps, GPS coordinates, device hardware signatures) and SHA-256 duplicate detection.

## Key Stakeholders & Roles
1. **Students**: Upload uncompressed camera images (JPEG/PNG). Receive immediate client-side verification verdicts, view extracted telemetry, and print submission certificates.
2. **Lecturers / Department Reviewers**: Audit submissions across courses, filter by status (Verified, Suspicious, Reused), inspect flagged anomalies, search by student registration number, and export class summary reports for grading archives.

## Privacy & Architectural Guarantees
- **100% Client-Side**: All parsing (`exifr`), hashing (`crypto.subtle.digest`), and verification logic executes locally in the user's browser.
- **Zero Server Uploads**: No student photograph or sensitive lab specimen is transmitted to an external server or cloud database.
- **Case Study Anchor**: Faculty of Physical Sciences, Nnamdi Azikiwe University (UNIZIK), Awka.
