export type GpsCoordinates = {
  latitude: number | null;
  longitude: number | null;
};

export type MetadataResult = {
  captureTime: string | null;
  gps: GpsCoordinates;
  device: string | null;
  locationName: string | null;
  completeness: "Complete" | "Partial" | "Missing";
  /** True when GPS tags exist in the file but hold no usable values
   * (typical of transcoded/stripped copies, e.g. WhatsApp exports). */
  gpsTagsPresent: boolean;
};

export type VerificationStatus = "Verified" | "Suspicious" | "Reused";

export type CheckResult = "Pass" | "Fail";

export type VerificationResult = {
  status: VerificationStatus;
  reason: string;
  timeCheck: CheckResult;
  locationCheck: CheckResult;
  deviceCheck: CheckResult;
  duplicateCheck: CheckResult;
  reused: boolean;
};

export type SubmittedBy = {
  name: string;
  /** Registration number of the submitting student. */
  identifier: string;
};

export type HistoryEntry = {
  id: string;
  hash: string;
  fileName: string;
  /** Downscaled thumbnail (data URL) — kept small so history fits in localStorage. */
  previewUrl: string;
  checkedAt: string;
  status: VerificationStatus;
  reason: string;
  metadata: MetadataResult;
  verification?: VerificationResult;
  submittedBy?: SubmittedBy | null;
};
