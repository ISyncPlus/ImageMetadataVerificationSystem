import Image from "next/image";
import type { ChangeEvent } from "react";
import GlassCard from "./GlassCard";

type UploadCardProps = {
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  fileName: string | null;
  hash: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadCard({
  isProcessing,
  error,
  previewUrl,
  fileName,
  hash,
  onFileChange,
}: UploadCardProps) {
  return (
    <GlassCard
      title="Image Upload"
      subtitle="Submit image for verification"
      actions={
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          {isProcessing ? "Processing" : "Ready"}
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center transition hover:border-cyan-400/60 hover:bg-white/10">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10">
            <span className="text-xl text-cyan-200">+</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Drop or select a JPEG/PNG file
            </p>
            <p className="text-xs text-white/50">
              SHA-256 hashing and EXIF inspection runs locally
            </p>
          </div>
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/30">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={fileName ?? "Preview"}
                width={64}
                height={64}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                No Preview
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {fileName ?? "Awaiting submission"}
            </p>
            <p className="text-xs text-white/50">
              {hash ? `SHA-256: ${hash.slice(0, 18)}…` : "Hash will appear here"}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
