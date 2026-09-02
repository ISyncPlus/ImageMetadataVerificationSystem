import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lecturer Departmental Ledger & Audit Console",
  description:
    "Audit student submissions across physical science courses, inspect flagged anomalies, filter duplicate submissions, and export class reports.",
  alternates: {
    canonical: "/lecturer",
  },
};

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
