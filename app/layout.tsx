import type { Metadata, Viewport } from "next";
import { THEME_BOOTSTRAP } from "../lib/theme";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

/* Exposed as --font-inter, not --font-sans: the theme's --font-sans appends the
   platform fallback stack to it, and a variable cannot reference itself. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Image Metadata Verification System",
  description:
    "Prototype for verifying capture time, location, and device metadata of student image submissions — Faculty of Physical Sciences, Nnamdi Azikiwe University.",
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
