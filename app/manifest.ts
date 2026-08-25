import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Provenance — Image Metadata & Verification System",
    short_name: "Provenance",
    description:
      "Browser-native image provenance and metadata verification system for academic submissions, laboratory fieldwork, and SIWES reports.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#0066cc",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
