import type { MetadataResult } from "./types";

export const formatCoordinate = (value: number | null | undefined): string =>
  value != null && Number.isFinite(value) ? value.toFixed(5) : "Not available";

export const hasCoordinates = (gps: MetadataResult["gps"]): boolean =>
  gps.latitude != null &&
  gps.longitude != null &&
  Number.isFinite(gps.latitude) &&
  Number.isFinite(gps.longitude);

/** "6.24560, 7.11890", or null when the file carries no usable position. */
export const formatCoordinates = (
  gps: MetadataResult["gps"]
): string | null =>
  hasCoordinates(gps)
    ? `${formatCoordinate(gps.latitude)}, ${formatCoordinate(gps.longitude)}`
    : null;

export const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
