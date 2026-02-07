"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import GlassCard from "../components/GlassCard";
import HistoryItem from "../components/HistoryItem";
import StatusBadge from "../components/StatusBadge";
import { readFileAsArrayBuffer, readFileAsDataUrl } from "../lib/file";
import { hashArrayBuffer } from "../lib/hash";
import { extractMetadata } from "../lib/metadata";
import { loadHistory, saveHistory } from "../lib/storage";
import { verifyImage } from "../lib/verification";
import type { HistoryEntry, MetadataResult, VerificationResult } from "../lib/types";

const formatCoordinate = (value: number | null) =>
  value != null ? value.toFixed(5) : "Not Available";

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [metadata, setMetadata] = useState<MetadataResult | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const stats = useMemo(() => {
    const verified = history.filter((entry) => entry.status === "Verified").length;
    const suspicious = history.filter((entry) => entry.status === "Suspicious").length;
    const reused = history.filter((entry) => entry.status === "Reused").length;
    return {
      total: history.length,
      verified,
      suspicious,
      reused,
    };
  }, [history]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please upload a JPEG or PNG image.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setMetadata(null);
    setVerification(null);
    setHash(null);
    setPreviewUrl(null);
    setFileName(file.name);

    try {
      const [buffer, dataUrl] = await Promise.all([
        readFileAsArrayBuffer(file),
        readFileAsDataUrl(file),
      ]);
      setPreviewUrl(dataUrl);

      const [computedHash, extractedMetadata] = await Promise.all([
        hashArrayBuffer(buffer),
        extractMetadata(buffer),
      ]);

      setHash(computedHash);
      setMetadata(extractedMetadata);

      const existingHistory = loadHistory();
      const verificationResult = verifyImage(
        extractedMetadata,
        computedHash,
        existingHistory
      );

      setVerification(verificationResult);

      const entry: HistoryEntry = {
        id: crypto.randomUUID?.() ?? `${Date.now()}`,
        hash: computedHash,
        fileName: file.name,
        previewUrl: dataUrl,
        checkedAt: new Date().toISOString(),
        status: verificationResult.status,
        reason: verificationResult.reason,
        metadata: extractedMetadata,
      };

      const updatedHistory = [entry, ...existingHistory].slice(0, 20);
      saveHistory(updatedHistory);
      setHistory(updatedHistory);
    } catch (processingError) {
      console.error(processingError);
      setError("Unable to process this image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-bg" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-cyan-300/70">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            Control Centre Dashboard
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              Image Metadata Verification System
            </h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Verify capture time and location authenticity for SIWES, fieldwork,
              and laboratory submissions using real image metadata directly in
              the browser.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Total Checks
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.total}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Verified
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {stats.verified}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Suspicious
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-300">
                {stats.suspicious}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Reused
              </p>
              <p className="mt-2 text-2xl font-semibold text-rose-300">
                {stats.reused}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
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
                  onChange={handleFileChange}
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

          <GlassCard
            title="Metadata Display"
            subtitle="Capture time, location, device"
          >
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Capture Time</span>
                <span className="text-white">
                  {metadata?.captureTime ?? "Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Latitude</span>
                <span className="text-white">
                  {formatCoordinate(metadata?.gps.latitude ?? null)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Longitude</span>
                <span className="text-white">
                  {formatCoordinate(metadata?.gps.longitude ?? null)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Device Info</span>
                <span className="text-white">
                  {metadata?.device ?? "Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Completeness</span>
                <span className="text-white">
                  {metadata?.completeness ?? "Awaiting data"}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Verification Result"
            subtitle="Authenticity assessment"
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

          <GlassCard
            title="Verification History"
            subtitle="Previous submissions"
            className="lg:col-span-3"
          >
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
                  No verifications yet. Upload an image to start building history.
                </div>
              ) : (
                history.map((entry) => (
                  <HistoryItem key={entry.id} entry={entry} />
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
