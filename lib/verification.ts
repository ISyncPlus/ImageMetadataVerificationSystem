import type { HistoryEntry, MetadataResult, VerificationResult } from "./types";

export const verifyImage = (
  metadata: MetadataResult,
  hash: string,
  history: HistoryEntry[]
): VerificationResult => {
  const reused = history.some((entry) => entry.hash === hash);
  const timeCheck = metadata.captureTime ? "Pass" : "Fail";
  const locationCheck =
    metadata.gps.latitude != null && metadata.gps.longitude != null
      ? "Pass"
      : "Fail";

  if (reused) {
    return {
      status: "Reused",
      reason: "This image hash matches a previous submission.",
      timeCheck,
      locationCheck,
      reused,
    };
  }

  if (timeCheck === "Pass" && locationCheck === "Pass") {
    return {
      status: "Verified",
      reason: "Capture time and GPS location are present.",
      timeCheck,
      locationCheck,
      reused,
    };
  }

  return {
    status: "Suspicious",
    reason: "Missing capture time or GPS location metadata.",
    timeCheck,
    locationCheck,
    reused,
  };
};
