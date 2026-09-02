import type { Metadata, Viewport } from "next";
import { THEME_BOOTSTRAP } from "../lib/theme";
import "./globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://provenance-unizik.edu.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Provenance: Image Metadata & Verification System",
    template: "%s | Provenance",
  },
  description:
    "Browser-native image provenance and metadata verification system for academic submissions, laboratory fieldwork, and SIWES reports at Faculty of Physical Sciences, Nnamdi Azikiwe University.",
  applicationName: "Provenance",
  authors: [{ name: "Ebube Ezedimbu", url: siteUrl }],
  keywords: [
    "Image Metadata Verification",
    "EXIF Verification",
    "Provenance",
    "Academic Integrity",
    "SIWES Image Verification",
    "UNIZIK Faculty of Physical Sciences",
    "Digital Provenance",
    "Client-Side EXIF",
    "SHA-256 Photo Audit",
  ],
  creator: "Ebube Ezedimbu",
  publisher: "Faculty of Physical Sciences, Nnamdi Azikiwe University",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Provenance: Image Metadata & Verification System",
    description:
      "Proof that a photo is what it claims to be. Browser-native EXIF extraction, timestamp auditing, GPS geocoding, and cryptographic duplicate detection.",
    url: siteUrl,
    siteName: "Provenance",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Provenance: Image Metadata & Verification System banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Provenance: Image Metadata & Verification System",
    description:
      "Proof that a photo is what it claims to be. Academic image provenance and metadata verification.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0c" },
  ],
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Faculty of Physical Sciences, Nnamdi Azikiwe University",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      sameAs: ["https://unizik.edu.ng"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Faculty of Physical Sciences, Nnamdi Azikiwe University Main Campus",
        addressLocality: "Awka",
        addressRegion: "Anambra State",
        postalCode: "420110",
        addressCountry: "NG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.24831,
        longitude: 7.11472,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "Provenance: Image Metadata & Verification System",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All modern web browsers (Chromium, Safari, Firefox)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Person",
        name: "Ebube Ezedimbu",
        jobTitle: "Lead Software Engineer & Researcher",
        affiliation: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    },
  ],
};

import { Suspense } from "react";
import { UtmTracker } from "../components/UtmTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <head>
        {/*
          The three faces the first screen is set in. They live in /public and
          are declared with @font-face in globals.css, so nothing is preloaded
          by the framework on our behalf — these links are what stop the type
          from arriving a beat after the layout does. Only the latin subsets
          are preloaded; latin-ext loads on demand.
        */}
        {["inter", "bricolage-grotesque", "jetbrains-mono"].map((face) => (
          <link
            key={face}
            rel="preload"
            as="font"
            type="font/woff2"
            href={`/fonts/${face}-latin.woff2`}
            crossOrigin="anonymous"
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="grain antialiased">
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <UtmTracker />
        </Suspense>
        {/* Resolves the theme before first paint — no flash of the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {children}
      </body>
    </html>
  );
}

