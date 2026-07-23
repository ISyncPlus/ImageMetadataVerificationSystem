import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";
import type { VerificationResult } from "../lib/types";

type VerificationCardProps = {
  verification: VerificationResult | null;
  onDownloadReport?: () => void;
};

const checks: Array<{
  key: "timeCheck" | "locationCheck" | "deviceCheck" | "duplicateCheck";
  label: string;
}> = [
  { key: "timeCheck", label: "Time Check" },
  { key: "locationCheck", label: "Location Check" },
  { key: "deviceCheck", label: "Device Check" },
  { key: "duplicateCheck", label: "Duplicate Check" },
];

export default function VerificationCard({
  verification,
  onDownloadReport,
}: VerificationCardProps) {
  return (
    <GlassCard
      title="Verification Result"
      subtitle="Authenticity assessment"
      actions={
        verification && onDownloadReport ? (
          <button
            type="button"
            onClick={onDownloadReport}
            className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/25"
          >
            Report
          </button>
        ) : undefined
      }
    >
      {verification ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={verification.status} />
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              {verification.reused ? "Prior submission" : "New entry"}
            </p>
          </div>
          <p className="text-sm text-white/70">{verification.reason}</p>
          <div className="grid gap-3 text-xs md:grid-cols-2">
            {checks.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <p className="text-white/40">{label}</p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    verification[key] === "Pass"
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
                >
                  {verification[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center text-sm text-white/60">
          Upload an image to generate verification status.
        </div>
      )}
    </GlassCard>
  );
}
