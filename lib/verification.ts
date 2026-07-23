import type {
  CheckResult,
  HistoryEntry,
  MetadataResult,
  VerificationResult,
} from "./types";

/**
 * Applies the verification rules described in Chapter Three:
 * timestamp check, GPS location check, device information check,
 * and duplicate (reuse) detection via SHA-256 hash comparison.
 */
export const verifyImage = (
  metadata: MetadataResult,
  hash: string,
  history: HistoryEntry[]
): VerificationResult => {
  const reused = history.some((entry) => entry.hash === hash);

  const timeCheck: CheckResult = metadata.captureTime ? "Pass" : "Fail";
  const locationCheck: CheckResult =
    metadata.gps.latitude != null &&
    metadata.gps.longitude != null &&
    Number.isFinite(metadata.gps.latitude) &&
    Number.isFinite(metadata.gps.longitude)
      ? "Pass"
      : "Fail";
  const deviceCheck: CheckResult = metadata.device ? "Pass" : "Fail";
  const duplicateCheck: CheckResult = reused ? "Fail" : "Pass";

  if (reused) {
    return {
      status: "Reused",
      reason:
        "This image's SHA-256 hash matches a previous submission — possible duplicate or reused evidence.",
      timeCheck,
      locationCheck,
      deviceCheck,
      duplicateCheck,
      reused,
    };
  }

  const failures: string[] = [];
  if (timeCheck === "Fail") failures.push("capture time");
  if (locationCheck === "Fail") failures.push("GPS location");
  if (deviceCheck === "Fail") failures.push("device information");

  if (failures.length === 0) {
    return {
      status: "Verified",
      reason:
        "Capture time, GPS location, and device information are all present and consistent.",
      timeCheck,
      locationCheck,
      deviceCheck,
      duplicateCheck,
      reused,
    };
  }

  const missing =
    failures.length === 1
      ? failures[0]
      : `${failures.slice(0, -1).join(", ")} and ${failures[failures.length - 1]}`;

  return {
    status: "Suspicious",
    reason: `Missing or unreadable ${missing}. The metadata may have been stripped or altered.`,
    timeCheck,
    locationCheck,
    deviceCheck,
    duplicateCheck,
    reused,
  };
};
