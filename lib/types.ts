export type GpsCoordinates = {
  latitude: number | null;
  longitude: number | null;
};

/**
 * How a submission came to exist, which decides what its metadata can be
 * expected to prove.
 *
 * - `uploaded` — a file chosen from storage. The only thing vouching for it is
 *   whatever the file itself carries, and a file's contents are editable.
 * - `witnessed` — captured inside Provenance. The app held the camera stream
 *   and read the device position at the same instant, so the coordinates are
 *   bound to the moment of capture rather than asserted about it afterwards.
 */
export type CaptureMode = "uploaded" | "witnessed";

/** Where a set of coordinates came from, in descending order of weight. */
export type LocationSource =
  /** Read out of the photograph's own EXIF or XMP. */
  | "embedded"
  /** Read from the device at the instant the app took the picture. */
  | "witnessed"
  /** Read from the device when the student uploaded an existing file. */
  | "attested";

/** One positional reading, with the uncertainty the device reported. */
export type LocationFix = {
  latitude: number;
  longitude: number;
  /** Radius of uncertainty in metres, as reported by the device. */
  accuracyMetres: number | null;
  /** ISO timestamp of the fix itself, not of the submission. */
  fixedAt: string;
};

/**
 * A position offered alongside a submission, and the reason it is or is not
 * evidence about the photograph.
 *
 * An `attested` fix says where the student was when they pressed submit. That
 * is a different claim from where the photograph was taken, and the two must
 * never be shown as though they were the same thing — so the source travels
 * with the coordinates everywhere they go.
 */
export type LocationAttestation = LocationFix & {
  source: Exclude<LocationSource, "embedded">;
  /** Seconds between the position fix and the image being read. */
  driftSeconds: number | null;
  locationName: string | null;
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
  /** Which tier satisfied the location check, or null when none did. */
  locationSource: LocationSource | null;
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
  /** How the image reached the system. Absent on records filed before this
   *  was tracked, which are all uploads. */
  captureMode?: CaptureMode;
  /** A device position offered with the submission. Never merged into
   *  `metadata.gps`, which means "what the file itself contained". */
  location?: LocationAttestation | null;
};
