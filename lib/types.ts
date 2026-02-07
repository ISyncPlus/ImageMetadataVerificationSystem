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
};

export type VerificationStatus = "Verified" | "Suspicious" | "Reused";

export type VerificationResult = {
  status: VerificationStatus;
  reason: string;
  timeCheck: "Pass" | "Fail";
  locationCheck: "Pass" | "Fail";
  reused: boolean;
};

export type HistoryEntry = {
  id: string;
  hash: string;
  fileName: string;
  previewUrl: string;
  checkedAt: string;
  status: VerificationStatus;
  reason: string;
  metadata: MetadataResult;
};
