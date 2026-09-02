import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Onboarding & Identity Claim",
  description:
    "Claim your student registration number or lecturer reviewer credentials on the Provenance academic ledger.",
  alternates: {
    canonical: "/onboarding",
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
