import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Image Inspector & Telemetry Audit",
  description:
    "Upload coursework photographs for in-browser EXIF telemetry analysis, GPS proximity verification, and printable archival PDF certification.",
  alternates: {
    canonical: "/student",
  },
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
