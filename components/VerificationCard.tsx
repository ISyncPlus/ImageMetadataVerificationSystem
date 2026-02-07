import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";
import type { VerificationResult } from "../lib/types";

type VerificationCardProps = {
  verification: VerificationResult | null;
};

export default function VerificationCard({ verification }: VerificationCardProps) {
  return (
    <GlassCard title="Verification Result" subtitle="Authenticity assessment">
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/40">Time Check</p>
              <p className="mt-1 text-sm text-white">
                {verification.timeCheck}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/40">Location Check</p>
              <p className="mt-1 text-sm text-white">
                {verification.locationCheck}
              </p>
            </div>
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
