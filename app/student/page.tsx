"use client";

import { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import HistoryList from "../../components/HistoryList";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import { Button } from "../../components/ui/Button";
import SubmitWorkspace from "../../components/dashboard/SubmitWorkspace";
import type { WorkspacePhase } from "../../components/dashboard/SubmitWorkspace";
import { Alert, Doc } from "../../components/ui/icons";
import { createThumbnail, readFileAsArrayBuffer, readFileAsDataUrl } from "../../lib/file";
import { hashArrayBuffer } from "../../lib/hash";
import { extractMetadata } from "../../lib/metadata";
import {
  buildEntryReportHtml,
  buildSummaryReportHtml,
  openPrintableReport,
} from "../../lib/report";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { ApiError, createSubmission } from "../../lib/api";
import { useRequireProfile } from "../../lib/useProfile";
import { useSubmissions } from "../../lib/useSubmissions";
import { verifyImage } from "../../lib/verification";
import type { HistoryEntry, MetadataResult } from "../../lib/types";

const getExtension = (name: string): string =>
  name.toLowerCase().match(/\.([a-z0-9]+)$/i)?.[1] ?? "";

const validateImageFile = (file: File): string | null => {
  if (file.size === 0) return "That file is empty.";
  if (file.size > 25 * 1024 * 1024)
    return "That file is larger than 25 MB. Use the original camera photo, not a video frame export.";

  const extension = getExtension(file.name);
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    extension === "heic" ||
    extension === "heif";
  if (isHeic)
    return "HEIC/HEIF files usually lose their EXIF data in browsers. Export the photo as JPEG and try again.";

  const isJpeg =
    file.type === "image/jpeg" || extension === "jpg" || extension === "jpeg";
  const isPng = file.type === "image/png" || extension === "png";
  if (!isJpeg && !isPng) return "Please choose a JPEG or PNG image.";

  return null;
};

/** Resolves a place name for coordinates that came from the photo's own EXIF. */
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

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("zoom", "18");
    url.searchParams.set("accept-language", "en");

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return metadata;

    const data = (await response.json()) as { display_name?: string };
    return typeof data.display_name === "string"
      ? { ...metadata, locationName: data.display_name }
      : metadata;
  } catch {
    // Geocoding is a nicety; coordinates alone still satisfy the check.
    return metadata;
  }
};

export default function StudentDashboard() {
  const { profile, loading: profileLoading } = useRequireProfile("student");
  const { submissions, stats, initialLoading, error: listError, prepend } =
    useSubmissions({ take: 25 });

  const [phase, setPhase] = useState<WorkspacePhase>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [duplicateOfOtherUser, setDuplicateOfOtherUser] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  const reset = () => {
    setPhase("idle");
    setPreviewUrl(null);
    setFileName(null);
    setStep(null);
    setError(null);
    setEntry(null);
    setDuplicateOfOtherUser(false);
    setOfflineNotice(null);
  };

  const handleFile = async (file: File) => {
    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      setPhase("idle");
      return;
    }

    setError(null);
    setEntry(null);
    setDuplicateOfOtherUser(false);
    setOfflineNotice(null);
    setFileName(file.name);
    setPhase("working");

    try {
      setStep("Reading the file");
      const [buffer, dataUrl] = await Promise.all([
        readFileAsArrayBuffer(file),
        readFileAsDataUrl(file),
      ]);
      setPreviewUrl(dataUrl);

      setStep("Extracting EXIF metadata");
      const [hash, extracted] = await Promise.all([
        hashArrayBuffer(buffer),
        extractMetadata(buffer),
      ]);

      setStep("Resolving location");
      const metadata = await attachLocationName(extracted);

      setStep("Checking against the ledger");
      const thumbnail = await createThumbnail(dataUrl);

      /*
       * A provisional verdict computed here, so a result still appears if the
       * server is unreachable (ARCHITECTURE.md, Decision 5). It is deliberately
       * given no history: this device cannot see other students' hashes, so it
       * must never claim a file is unique — only the server can settle that.
       */
      const local = verifyImage(metadata, hash, []);
      const provisional: HistoryEntry = {
        id: `local-${hash.slice(0, 12)}`,
        hash,
        fileName: file.name,
        previewUrl: thumbnail,
        checkedAt: new Date().toISOString(),
        status: local.status,
        reason: local.reason,
        metadata,
        verification: local,
        submittedBy: {
          name: profile?.name ?? "",
          identifier: profile?.identifier ?? "",
        },
      };

      try {
        // The server is the authority: it alone sees every student's hashes.
        const result = await createSubmission({
          hash,
          fileName: file.name,
          thumbnailUrl: thumbnail,
          metadata: {
            captureTime: metadata.captureTime,
            latitude: metadata.gps.latitude,
            longitude: metadata.gps.longitude,
            locationName: metadata.locationName,
            device: metadata.device,
            gpsTagsPresent: metadata.gpsTagsPresent,
          },
        });

        setEntry(result.submission);
        setDuplicateOfOtherUser(result.duplicateOfOtherUser);
        prepend(result.submission);
      } catch (caught) {
        if (!(caught instanceof ApiError)) throw caught;

        // Show the local reading rather than nothing, and say plainly that it
        // is unfiled and cannot account for duplicates.
        setEntry(provisional);
        setOfflineNotice(
          `${caught.message} This result was produced on your device, has not been filed, and cannot check for duplicates.`
        );
      }

      setPhase("result");
    } catch (caught) {
      console.error(caught);
      setError("Could not read that image. Please try another file.");
      setPhase("idle");
    } finally {
      setStep(null);
    }
  };

  if (profileLoading || !profile) {
    return (
      <PageShell>
        <div className="flex flex-col gap-4 pt-4">
          <div className="shimmer h-8 w-64 rounded-lg bg-well" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="shimmer h-24 rounded-xl bg-well" />
            ))}
          </div>
          <div className="shimmer h-72 rounded-2xl bg-well" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell session={profile}>
      <div className="py-2">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Student Inspector" },
          ]}
        />
      </div>

      <DashboardHeader
        stats={stats}
        eyebrow="Student"
        title={`Welcome, ${profile.name.split(" ")[0]}`}
        subtitle="Submit an original practical, laboratory, fieldwork or SIWES photo. Your file is read on this device: only the resulting record is filed."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal index={2} className="lg:col-span-3">
          <SubmitWorkspace
            phase={phase}
            previewUrl={previewUrl}
            fileName={fileName}
            step={step}
            error={error}
            entry={entry}
            duplicateOfOtherUser={duplicateOfOtherUser}
            offlineNotice={offlineNotice}
            onFile={(file) => void handleFile(file)}
            onReset={reset}
            onReport={() => entry && openPrintableReport(buildEntryReportHtml(entry))}
          />
        </Reveal>

        <Reveal index={3} className="lg:col-span-2">
          <Card
            title="Your submissions"
            subtitle={
              stats.total === 1 ? "1 record" : `${stats.total} records`
            }
            actions={
              submissions.length > 0 ? (
                <Button
                  size="sm"
                  onClick={() =>
                    openPrintableReport(buildSummaryReportHtml(submissions))
                  }
                >
                  <Doc size={14} />
                  Summary
                </Button>
              ) : null
            }
            bodyClassName="max-h-[32rem] overflow-y-auto"
          >
            {listError ? (
              <p className="t-footnote flex items-start gap-2 rounded-xl border border-bad/30 bg-bad-wash px-3.5 py-2.5 text-bad">
                <Alert size={14} className="mt-0.5 shrink-0" />
                {listError}
              </p>
            ) : initialLoading ? (
              <div className="flex flex-col gap-2.5">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="shimmer h-20 rounded-xl bg-well" />
                ))}
              </div>
            ) : (
              <HistoryList
                entries={submissions}
                onEntryReport={(item) =>
                  openPrintableReport(buildEntryReportHtml(item))
                }
                emptyMessage="Nothing checked yet. Your submissions will appear here."
              />
            )}
          </Card>
        </Reveal>
      </div>
    </PageShell>
  );
}
