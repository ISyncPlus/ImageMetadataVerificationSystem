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
