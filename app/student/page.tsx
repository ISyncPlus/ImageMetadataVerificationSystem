"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import AppNavbar from "../../components/AppNavbar";
import CardsGrid from "../../components/CardsGrid";
import DashboardHeader from "../../components/DashboardHeader";
import PageShell from "../../components/PageShell";
import {
  createThumbnail,
  readFileAsArrayBuffer,
  readFileAsDataUrl,
} from "../../lib/file";
import { hashArrayBuffer } from "../../lib/hash";
import { extractMetadata } from "../../lib/metadata";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import { loadHistory, saveHistory } from "../../lib/storage";
import { useRequireSession } from "../../lib/useSession";
import { verifyImage } from "../../lib/verification";
import type { HistoryEntry, MetadataResult } from "../../lib/types";

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

/** Resolves a place name for coordinates extracted from the image's own
 * EXIF data (never the verifier's device). */
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

export default function StudentDashboard() {
  const session = useRequireSession("student");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<HistoryEntry | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const myHistory = useMemo(
    () =>
      session
        ? history.filter(
            (entry) => entry.submittedBy?.identifier === session.identifier
          )
        : [],
    [history, session]
  );

  const stats = useMemo(() => {
    const verified = myHistory.filter((entry) => entry.status === "Verified").length;
    const suspicious = myHistory.filter((entry) => entry.status === "Suspicious").length;
    const reused = myHistory.filter((entry) => entry.status === "Reused").length;
    return {
      total: myHistory.length,
      verified,
      suspicious,
      reused,
    };
  }, [myHistory]);

  const handleEntryReport = (entry: HistoryEntry) => {
    openPrintableReport(buildEntryReportHtml(entry));
  };

  const handleSummaryReport = () => {
    if (myHistory.length > 0) {
      openPrintableReport(buildSummaryReportHtml(myHistory));
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session) {
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.ok) {
      setError(validation.message ?? "Unsupported image file.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentEntry(null);
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

      const resolvedMetadata = await attachLocationName(extractedMetadata);

      const existingHistory = loadHistory();
      const verificationResult = verifyImage(
        resolvedMetadata,
        computedHash,
        existingHistory
      );

      const thumbnailUrl = await createThumbnail(dataUrl);

      const entry: HistoryEntry = {
        id: crypto.randomUUID?.() ?? `${Date.now()}`,
        hash: computedHash,
        fileName: file.name,
        previewUrl: thumbnailUrl,
        checkedAt: new Date().toISOString(),
        status: verificationResult.status,
        reason: verificationResult.reason,
        metadata: resolvedMetadata,
        verification: verificationResult,
        submittedBy: {
          name: session.name,
          identifier: session.identifier,
        },
      };

      setCurrentEntry(entry);

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

  if (!session) {
    return null;
  }

  return (
    <PageShell>
      <AppNavbar session={session} />
      <DashboardHeader
        stats={stats}
        eyebrow="Student Dashboard"
        subtitle={`Submit practical, laboratory, fieldwork, or SIWES images for verification, ${session.name.split(" ")[0]}.`}
      />
      <CardsGrid
        isProcessing={isProcessing}
        error={error}
        previewUrl={previewUrl}
        fileName={fileName}
        currentEntry={currentEntry}
        history={myHistory}
        onFileChange={handleFileChange}
        onClearHistory={undefined}
        onEntryReport={handleEntryReport}
        onSummaryReport={handleSummaryReport}
        formatCoordinate={formatCoordinate}
      />
    </PageShell>
  );
}
