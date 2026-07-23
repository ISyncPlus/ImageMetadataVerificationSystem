# Image Metadata Verification System (IMVS)

A prototype web application for verifying the authenticity of image submissions
in practical coursework, laboratory work, fieldwork, and SIWES reports.
Developed as a Final Year Project using the Faculty of Physical Sciences,
Nnamdi Azikiwe University, Awka as the case study.

Built with [Next.js](https://nextjs.org) (App Router). All processing runs in
the browser — no backend, no authentication, no image ever leaves the device.

## Application Flow

- **Landing page** (`/`) — project overview with sign-in entry point.
- **Login** (`/login`) — simulated role-based authentication (student or
  lecturer); details are stored locally and attached to verification records.
- **Student dashboard** (`/student`) — upload and verify images; view and
  print reports for your own submissions.
- **Lecturer dashboard** (`/lecturer`) — review all submissions with search
  and status filters, inspect flagged records, and generate reports.

## Features

- **Image upload** — JPEG/PNG submissions via a drag-and-drop dashboard.
- **Metadata extraction** — EXIF capture time, GPS coordinates, and device
  make/model extracted locally with `exifr`.
- **Verification engine** — four rule-based checks: capture time, GPS
  location, device information, and duplicate (reuse) detection.
- **Duplicate detection** — SHA-256 hashing flags images that match any
  previous submission.
- **Reverse geocoding** — EXIF coordinates are resolved to a human-readable
  place name via OpenStreetMap Nominatim.
- **Verification reports** — printable per-image reports and an overall
  summary report for lecturers (save as PDF from the print dialog).
- **Verification history** — the last 20 checks persist in `localStorage`
  with quota-safe thumbnails.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Notes

- Upload original files from the device camera (e.g. `DCIM/Camera`). Social
  apps and editors usually strip EXIF metadata; such images will honestly
  fail the time/location checks and be flagged as Suspicious.
- Missing metadata does not by itself prove misconduct — reports are decision
  support for the course lecturer, not a verdict.

Made with 💙 by Ebube Ezedimbu
