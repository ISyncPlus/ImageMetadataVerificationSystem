"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import CardsGrid from "../components/CardsGrid";
import DashboardHeader from "../components/DashboardHeader";
import PageShell from "../components/PageShell";
import { readFileAsArrayBuffer, readFileAsDataUrl } from "../lib/file";
import { hashArrayBuffer } from "../lib/hash";
import { extractDebugMetadata, extractMetadata } from "../lib/metadata";
import type { DebugMetadata } from "../lib/metadata";
import { clearHistory, loadHistory, saveHistory } from "../lib/storage";
import { verifyImage } from "../lib/verification";
import type { HistoryEntry, MetadataResult, VerificationResult } from "../lib/types";

const formatCoordinate = (value: number | null) =>
  value != null && Number.isFinite(value) ? value.toFixed(5) : "Not Available";

const getFileExtension = (name: string): string => {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/i);
  return match ? match[1] : "";
};

const validateImageFile = (file: File): { ok: boolean; message?: string } => {
  if (file.size === 0) {
    return { ok: false, message: "The selected file is empty." };
  }

  const extension = getFileExtension(file.name);
  const isJpeg = file.type === "image/jpeg" || extension === "jpg" || extension === "jpeg";
  const isPng = file.type === "image/png" || extension === "png";
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    extension === "heic" ||
    extension === "heif";

  if (isHeic) {
    return {
      ok: false,
      message:
        "HEIC/HEIF files often strip EXIF in browsers. Please upload an original JPEG or PNG.",
    };
  }

  if (!isJpeg && !isPng) {
    return { ok: false, message: "Please upload a JPEG or PNG image." };
  }

  return { ok: true };
};

const fetchLocationName = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", latitude.toString());
    url.searchParams.set("lon", longitude.toString());
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "0");
    url.searchParams.set("accept-language", "en");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { display_name?: string };
    return typeof data.display_name === "string" ? data.display_name : null;
  } catch {
    return null;
  }
};

const getBrowserLocation = (): Promise<{ latitude: number; longitude: number } | null> =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          resolve(null);
          return;
        }
        resolve({ latitude, longitude });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });

const attachLocationName = async (
  metadata: MetadataResult
): Promise<MetadataResult> => {
  const { latitude, longitude } = metadata.gps;
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return metadata;
  }

  const locationName = await fetchLocationName(latitude, longitude);
  return {
    ...metadata,
    locationName,
  };
};

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [metadata, setMetadata] = useState<MetadataResult | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugMetadata | null>(null);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

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

    const validation = validateImageFile(file);
    if (!validation.ok) {
      setError(validation.message ?? "Unsupported image file.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setMetadata(null);
    setVerification(null);
    setHash(null);
    setPreviewUrl(null);
    setFileName(file.name);
    setDebugInfo(null);

    try {
      const [buffer, dataUrl] = await Promise.all([
        readFileAsArrayBuffer(file),
        readFileAsDataUrl(file),
      ]);
      setPreviewUrl(dataUrl);

      const [computedHash, extractedMetadata, debugMetadata] = await Promise.all([
        hashArrayBuffer(buffer),
        extractMetadata(buffer),
        extractDebugMetadata(buffer),
      ]);

      setHash(computedHash);
      let resolvedMetadata = extractedMetadata;
      if (
        resolvedMetadata.gps.latitude == null ||
        resolvedMetadata.gps.longitude == null
      ) {
        const browserLocation = await getBrowserLocation();
        if (browserLocation) {
          resolvedMetadata = {
            ...resolvedMetadata,
            gps: {
              latitude: browserLocation.latitude,
              longitude: browserLocation.longitude,
            },
          };
        }
      }

      resolvedMetadata = await attachLocationName(resolvedMetadata);
      setMetadata(resolvedMetadata);
      setDebugInfo(debugMetadata);

      const existingHistory = loadHistory();
      const verificationResult = verifyImage(
        resolvedMetadata,
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
        metadata: resolvedMetadata,
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
    <PageShell>
      <DashboardHeader stats={stats} />
      <CardsGrid
        isProcessing={isProcessing}
        error={error}
        previewUrl={previewUrl}
        fileName={fileName}
        hash={hash}
        metadata={metadata}
        verification={verification}
        history={history}
        debugInfo={debugInfo}
        onFileChange={handleFileChange}
        onClearHistory={handleClearHistory}
        formatCoordinate={formatCoordinate}
      />
    </PageShell>
  );
}
