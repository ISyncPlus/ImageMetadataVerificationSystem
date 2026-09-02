# Provenance — Image Metadata & Verification System

A prototype web application for verifying the authenticity of image submissions
in practical coursework, laboratory work, fieldwork, and SIWES reports.
Developed as a Final Year Project using the Faculty of Physical Sciences,
Nnamdi Azikiwe University, Awka as the case study.

Built with [Next.js](https://nextjs.org) (App Router). Image analysis runs
entirely in the browser — the original file is never uploaded — while a
companion API persists the resulting records so reviewers can audit submissions
across the department.

> **Setup:** the API lives in the `Provenance Server` folder. Follow its
> [`ENV_SETUP.md`](../../Provenance%20Server/ENV_SETUP.md) first; the web app
> needs it running. The architecture, and the design review behind it, is in
> [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Application Flow

- **Landing page** (`/`) — project overview with sign-in entry point.
- **Login** (`/login`) — Google, GitHub, or email and password, via Better Auth.
- **Onboarding** (`/onboarding`) — claim a registration number or staff ID.
  Reviewer access requires a departmental invite code, verified server-side.
- **Student dashboard** (`/student`) — drop a photo, watch it being read, and
  get a verdict; review and print your own submission history.
- **Lecturer dashboard** (`/lecturer`) — the department-wide audit ledger, with
  server-side search, status filters, inspection sheet, and printable reports.

## Getting started

```bash
cp .env.local.example .env.local   # points at the API, default localhost:4000
npm install
npm run dev
```

## Features

- **Image upload** — JPEG/PNG submissions via a drag-and-drop dashboard.
- **Metadata extraction** — EXIF capture time, GPS coordinates, and device
  make/model extracted locally with `exifr`.
- **Verification engine** — four rule-based checks: capture time, GPS
  location, device information, and duplicate (reuse) detection.
- **Witnessed capture** — students can photograph a specimen inside Provenance;
  the device position is read as the shutter fires and bound to the record, so
  the app observes the evidence being made rather than being told about it.
  Uploaded files fall back to embedded EXIF/XMP coordinates, and to a clearly
  labelled attestation that never counts towards the verdict.
- **Duplicate detection** — SHA-256 hashing, compared server-side against every
  student's submissions, so recycled coursework is caught across the department
  rather than only within one browser.
- **Server-authoritative verdicts** — the browser computes a provisional result
  for instant (and offline) feedback, but the API re-derives the verdict from
  the submitted metadata. A client cannot assert its own status.
- **Reverse geocoding** — EXIF coordinates are resolved to a human-readable
  place name via OpenStreetMap Nominatim.
- **Verification reports** — printable per-image reports and an overall
  summary report for lecturers (save as PDF from the print dialog).
- **Role-based access** — students see only their own records; the department
  ledger is restricted to reviewers, enforced by API middleware.

## Interface

- **Light and dark appearance** — follows the system by default; the toggle in
  the navigation bar overrides it and the choice persists. Switching sweeps the
  new theme across the page with a View Transition.
- **Spring-based motion** — gestures and transitions use springs
  (`lib/motion.ts`) so they stay interruptible: a sheet can be caught mid-flight,
  thrown, and it lands where the throw was heading.
- **Accessible by default** — `prefers-reduced-motion`, `prefers-reduced-transparency`
  and `prefers-contrast` are each honoured, and the status palette is validated
  for colour-vision separation and 4.5:1 text contrast in both themes.

## Notes

- Open [http://localhost:3000](http://localhost:3000) once both the API and this
  app are running.
- Upload original files from the device camera (e.g. `DCIM/Camera`). Social
  apps and editors usually strip EXIF metadata; such images will honestly
  fail the time/location checks and be flagged as Suspicious.
- Missing metadata does not by itself prove misconduct — reports are decision
  support for the course lecturer, not a verdict.

## Credits

Two pieces of the interface are adapted from open-source work and are
maintained here as part of this codebase:

- **Theme transition** (`lib/theme-transition.ts`) — the View Transition CSS
  generator is adapted from [Skiper UI](https://skiper-ui.com)'s "Skiper 26"
  component by [@gurvinder-singh02](https://gxuri.me), itself inspired by
  [rudrodip/theme-toggle-effect](https://github.com/rudrodip/theme-toggle-effect).
  The demo scaffolding and its `next-themes` dependency were removed — this app
  has its own theme store in `lib/useTheme.ts` — leaving only the CSS generator.
  Skiper UI's licence requires attribution on the free version, so the original
  notice is kept at the foot of that file.
- **Animated background** (`components/SideRays.tsx`) — the WebGL ray field is
  the `SideRays` component from [React Bits](https://reactbits.dev), rendered
  through `components/ui/RaysBackground.tsx`, which tints it per theme and
  disables it entirely under `prefers-reduced-motion`.

Motion is powered by [Motion](https://motion.dev).

Made with 💙 by Ebube Ezedimbu
