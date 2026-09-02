import type { HistoryEntry } from "./types";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const formatCoordinates = (entry: HistoryEntry): string => {
  const { latitude, longitude } = entry.metadata.gps;
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return "Not available";
  }
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};

/**
 * The certificate has to be explicit about which tier of evidence produced the
 * location, because the tiers make different claims and the document may be
 * read months later by someone who was not there. An attested position in
 * particular says where the student was when submitting — printing it beside
 * the photograph's own metadata without that sentence would misrepresent it.
 */
const locationEvidenceSection = (entry: HistoryEntry): string => {
  const source = entry.verification?.locationSource ?? null;
  const attested = entry.location ?? null;
  if (!source) return "";

  const heading: Record<string, string> = {
    embedded: "Location evidence — from the photograph",
    witnessed: "Location evidence — witnessed at capture",
    attested: "Location evidence — attested by the student",
  };

  const claim: Record<string, string> = {
    embedded:
      "These coordinates were read from the file's own EXIF or XMP metadata.",
    witnessed:
      "Provenance captured this photograph and read the device position at the same instant. The coordinates describe the capture.",
    attested:
      "This position was reported by the student's device at the time of upload. It attests to the student's location when submitting and does NOT establish where the photograph was taken. It was not counted towards the location check.",
  };

  const coordinates =
    source === "embedded"
      ? formatCoordinates(entry)
      : attested
        ? `${attested.latitude.toFixed(6)}, ${attested.longitude.toFixed(6)}`
        : "Not available";

  const extra: string[] = [];
  if (attested?.accuracyMetres != null) {
    extra.push(
      `<tr><th>Reported accuracy</th><td>&plusmn;${Math.round(attested.accuracyMetres)} m</td></tr>`
    );
  }
  if (attested?.fixedAt) {
    extra.push(
      `<tr><th>Position fixed at</th><td>${formatDateTime(attested.fixedAt)}</td></tr>`
    );
  }
  if (attested?.driftSeconds != null) {
    extra.push(
      `<tr><th>Fix age at capture</th><td>${attested.driftSeconds}s before the shutter</td></tr>`
    );
  }
  if (attested?.locationName) {
    extra.push(
      `<tr><th>Resolved place</th><td>${escapeHtml(attested.locationName)}</td></tr>`
    );
  }

  return `
  <h2>${heading[source]}</h2>
  <table>
    <tr><th style="width:32%">Coordinates</th><td>${coordinates}</td></tr>
    ${extra.join("\n    ")}
    <tr><th>Capture mode</th><td>${entry.captureMode === "witnessed" ? "Captured inside Provenance" : "Uploaded file"}</td></tr>
  </table>
  <p style="margin:6px 0 0;font-size:11px;line-height:1.5;color:#444">${claim[source]}</p>`;
};

const statusColor: Record<string, string> = {
  Verified: "#1e8e3e",
  Suspicious: "#b26a00",
  Reused: "#c5221f",
};

const checkBadge = (result: "Pass" | "Fail" | undefined): string => {
  if (!result) return "<span>—</span>";
  const color = result === "Pass" ? "#1e8e3e" : "#c5221f";
  return `<span style="color:${color};font-weight:bold;">${result}</span>`;
};

const REPORT_STYLES = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #141416;
    margin: 40px auto;
    max-width: 760px;
    line-height: 1.55;
    background: #ffffff;
  }
  .brand-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #e04b28; margin-bottom: 4px; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; color: #141416; }
  h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 26px 0 10px; border-bottom: 1.5px solid #141416; padding-bottom: 4px; color: #141416; }
  .subtitle { color: #555; font-size: 12px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 6px; }
  th, td { border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; vertical-align: top; }
  th { background: #f8f7f4; font-weight: 600; color: #333; }
  .status { font-size: 16px; font-weight: 700; letter-spacing: 0.04em; }
  .meta { font-size: 11px; color: #666; margin-top: 36px; border-top: 1px solid #e0e0e0; padding-top: 12px; line-height: 1.6; }
  .hash { font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 11px; word-break: break-all; color: #333; }
  @media print { body { margin: 0.4in; } }
`;

const reportHeader = (title: string): string => `
  <h1>Provenance - Image Metadata &amp; Verification Report</h1>
  <div class="subtitle">
    ${title}<br/>
    Faculty of Physical Sciences, Nnamdi Azikiwe University: Practical Case Study
  </div>
`;

const reportFooter = (): string => `
  <div class="meta">
    Generated ${formatDateTime(new Date().toISOString())} by Provenance (Image Metadata &amp; Verification System). Verification is based on embedded EXIF
    metadata, GPS geocoding, device signatures, and SHA-256 duplicate detection; absence of metadata does not by
    itself prove misconduct, and results should be interpreted in context by the course
    lecturer.
  </div>
`;

export const buildEntryReportHtml = (entry: HistoryEntry): string => {
  const v = entry.verification;
  const color = statusColor[entry.status] ?? "#1a1a1a";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Verification Report: ${escapeHtml(entry.fileName)}</title>
<style>${REPORT_STYLES}</style>
</head>
<body>
  ${reportHeader("Single Image Verification Report")}

  <h2>Submission</h2>
  <table>
    <tr><th style="width:32%">File name</th><td>${escapeHtml(entry.fileName)}</td></tr>
    <tr><th>Submitted by</th><td>${
      entry.submittedBy
        ? `${escapeHtml(entry.submittedBy.name)} (${escapeHtml(entry.submittedBy.identifier)})`
        : "Not recorded"
    }</td></tr>
    <tr><th>Checked at</th><td>${formatDateTime(entry.checkedAt)}</td></tr>
    <tr><th>SHA-256 hash</th><td class="hash">${escapeHtml(entry.hash)}</td></tr>
  </table>

  <h2>Result</h2>
  <p class="status" style="color:${color};">${entry.status.toUpperCase()}</p>
  <p>${escapeHtml(entry.reason)}</p>

  ${locationEvidenceSection(entry)}

  <h2>Verification Checks</h2>
  <table>
    <tr><th style="width:32%">Capture time check</th><td>${checkBadge(v?.timeCheck)}</td></tr>
    <tr><th>Location check</th><td>${checkBadge(v?.locationCheck)}${
      v?.locationSource === "attested"
        ? ' <span style="font-size:11px;color:#a85900">attested position not counted</span>'
        : ""
    }</td></tr>
    <tr><th>Device information check</th><td>${checkBadge(v?.deviceCheck)}</td></tr>
    <tr><th>Duplicate (reuse) check</th><td>${checkBadge(v?.duplicateCheck)}</td></tr>
  </table>

  <h2>Extracted Metadata</h2>
  <table>
    <tr><th style="width:32%">Capture time</th><td>${escapeHtml(entry.metadata.captureTime ?? "Not available")}</td></tr>
    <tr><th>GPS coordinates</th><td>${formatCoordinates(entry)}</td></tr>
    <tr><th>Resolved location</th><td>${escapeHtml(entry.metadata.locationName ?? "Not available")}</td></tr>
    <tr><th>Device</th><td>${escapeHtml(entry.metadata.device ?? "Not available")}</td></tr>
    <tr><th>Metadata completeness</th><td>${entry.metadata.completeness}</td></tr>
  </table>

  ${reportFooter()}
</body>
</html>`;
};

export const buildSummaryReportHtml = (entries: HistoryEntry[]): string => {
  const verified = entries.filter((e) => e.status === "Verified").length;
  const suspicious = entries.filter((e) => e.status === "Suspicious").length;
  const reused = entries.filter((e) => e.status === "Reused").length;

  const rows = entries
    .map(
      (entry) => `
    <tr>
      <td>${escapeHtml(entry.fileName)}</td>
      <td>${entry.submittedBy ? escapeHtml(entry.submittedBy.name) : "-"}</td>
      <td>${formatDateTime(entry.checkedAt)}</td>
      <td style="color:${statusColor[entry.status] ?? "#1a1a1a"};font-weight:bold;">${entry.status}</td>
      <td>${escapeHtml(entry.metadata.captureTime ?? "-")}</td>
      <td>${formatCoordinates(entry)}</td>
      <td>${escapeHtml(entry.metadata.device ?? "-")}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Verification Summary Report</title>
<style>${REPORT_STYLES}</style>
</head>
<body>
  ${reportHeader("Verification Summary Report")}

  <h2>Overview</h2>
  <table>
    <tr><th style="width:32%">Total submissions checked</th><td>${entries.length}</td></tr>
    <tr><th>Verified</th><td style="color:#1e8e3e;font-weight:bold;">${verified}</td></tr>
    <tr><th>Suspicious</th><td style="color:#b26a00;font-weight:bold;">${suspicious}</td></tr>
    <tr><th>Reused (duplicates)</th><td style="color:#c5221f;font-weight:bold;">${reused}</td></tr>
  </table>

  <h2>Submissions</h2>
  <table>
    <tr>
      <th>File</th><th>Student</th><th>Checked</th><th>Status</th>
      <th>Capture time</th><th>GPS</th><th>Device</th>
    </tr>
    ${rows}
  </table>

  ${reportFooter()}
</body>
</html>`;
};

/** Opens the report in a reliable new window or iframe with auto-print. */
export const openPrintableReport = (html: string) => {
  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");

    if (win) {
      win.focus();
      win.onload = () => {
        setTimeout(() => {
          try {
            win.print();
          } catch {
            // print fallback
          }
        }, 300);
      };
      return;
    }

    // If popup blocked, create an invisible iframe to invoke print directly
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      }, 300);
    };
  } catch (e) {
    console.error("Failed to generate printable report", e);
  }
};
