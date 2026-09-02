import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Provenance: Image Metadata & Verification System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #18181b 0%, #09090b 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: "#f4f4f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              PROVENANCE
            </span>
            <span style={{ fontSize: "14px", color: "#a1a1aa" }}>
              Faculty of Physical Sciences · UNIZIK Awka
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#60a5fa",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            ⚡ Browser-Native Cryptographic Image Telemetry
          </div>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Proof of origin for every academic image submission.
          </h1>
          <p style={{ fontSize: "22px", color: "#a1a1aa", margin: 0, lineHeight: 1.4 }}>
            Temporal integrity · GPS geocoding · Sensor hardware fingerprints · SHA-256 duplicate detection.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ fontSize: "16px", color: "#22c55e", fontWeight: 600 }}>
              ✓ 100% Client-Side
            </span>
            <span style={{ fontSize: "16px", color: "#22c55e", fontWeight: 600 }}>
              ✓ Zero Cloud Uploads
            </span>
            <span style={{ fontSize: "16px", color: "#22c55e", fontWeight: 600 }}>
              ✓ &lt;50ms Response Time
            </span>
          </div>
          <span style={{ fontSize: "16px", color: "#71717a", fontFamily: "monospace" }}>
            provenance-unizik.edu.ng
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
