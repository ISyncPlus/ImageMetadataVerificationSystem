import type { VerificationStatus } from "../lib/types";

const statusStyles: Record<VerificationStatus, string> = {
  Verified: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40",
  Suspicious: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Reused: "bg-rose-500/15 text-rose-200 border-rose-500/40",
};

export default function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
}
