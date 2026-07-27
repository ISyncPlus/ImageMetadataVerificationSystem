import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Metadata Verification System",
  description:
    "Prototype for verifying capture time, location, and device metadata of student image submissions — Faculty of Physical Sciences, Nnamdi Azikiwe University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
