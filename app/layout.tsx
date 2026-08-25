import type { Metadata, Viewport } from "next";
import { THEME_BOOTSTRAP } from "../lib/theme";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

/* Exposed as --font-inter, not --font-sans: the theme's --font-sans appends the
   platform fallback stack to it, and a variable cannot reference itself. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Provenance — Image Metadata & Verification System",
    template: "%s | Provenance",
  },
  description:
    "Browser-native image provenance and metadata verification system for academic submissions, laboratory fieldwork, and SIWES reports — Faculty of Physical Sciences, Nnamdi Azikiwe University.",
  applicationName: "Provenance",
  authors: [{ name: "Ebube Ezedimbu" }],
  keywords: [
    "Image Metadata Verification",
    "EXIF Verification",
    "Provenance",
    "Academic Integrity",
    "SIWES Image Verification",
    "UNIZIK Faculty of Physical Sciences",
    "Digital Provenance",
  ],
  creator: "Ebube Ezedimbu",
  publisher: "Faculty of Physical Sciences, Nnamdi Azikiwe University",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Provenance — Image Metadata & Verification System",
    description:
      "Proof that a photo is what it claims to be. Browser-native EXIF extraction, timestamp auditing, GPS geocoding, and cryptographic duplicate detection.",
    siteName: "Provenance",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Provenance — Image Metadata & Verification System",
    description:
      "Proof that a photo is what it claims to be. Academic image provenance and metadata verification.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="antialiased">
        {/* Resolves the theme before first paint — no flash of the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {children}
      </body>
    </html>
  );
}
