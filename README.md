This is a [Next.js](https://nextjs.org) App Router project for a frontend-only Image Metadata Verification System.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

The app extracts real EXIF metadata in the browser (capture time, GPS coordinates, device info), computes a SHA-256 hash, and stores verification history in localStorage. It is strictly client-side with no backend or authentication.

## Notes

- Use original JPEG files from device cameras to ensure GPS/time metadata is present.
- Social apps and editors often strip metadata.

Made with 💙 by Ebube Ezedimbu
