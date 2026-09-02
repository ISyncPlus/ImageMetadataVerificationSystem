import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Access Inspector",
  description:
    "Sign in to Provenance with your institutional credentials or registration number to verify coursework photographs and access the departmental ledger.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
