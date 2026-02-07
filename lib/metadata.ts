import exifr from "exifr";
import type { MetadataResult } from "./types";

type ExifValue = number | { numerator: number; denominator: number };

const toNumber = (value: ExifValue): number => {
  if (typeof value === "number") {
    return value;
  }
  return value.numerator / value.denominator;
};

const parseCoordinateString = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const directionMatch = trimmed.match(/[NSEW]/i);
  const direction = directionMatch ? directionMatch[0].toUpperCase() : null;
  const numberMatches = trimmed.match(/-?\d+(?:\.\d+)?/g);
  if (!numberMatches || numberMatches.length === 0) {
    return null;
  }

  const numbers = numberMatches.map((item) => Number(item));
  if (numbers.some((item) => Number.isNaN(item))) {
    return null;
  }

  let coordinate = numbers[0];
  if (numbers.length >= 3) {
    const [deg, min, sec] = numbers;
    coordinate = deg + min / 60 + sec / 3600;
  }

  if (direction === "S" || direction === "W") {
    coordinate = -Math.abs(coordinate);
  }

  return coordinate;
};

const normalizeCoordinate = (value: unknown): number | null => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return parseCoordinateString(value);
  }

  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    return toNumber(value as ExifValue);
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [deg, min, sec] = value as ExifValue[];
    const degrees = toNumber(deg);
    const minutes = toNumber(min);
    const seconds = toNumber(sec);
    return degrees + minutes / 60 + seconds / 3600;
  }

  return null;
};

const parseExifDate = (value: unknown): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const [datePart, timePart] = value.split(" ");
    if (!datePart) {
      return null;
    }

    const formattedDate = datePart.replace(/:/g, "-");
    const isoLike = timePart ? `${formattedDate}T${timePart}` : formattedDate;
    const parsed = new Date(isoLike);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);

export const extractMetadata = async (
  buffer: ArrayBuffer
): Promise<MetadataResult> => {
  const data = await exifr.parse(
    buffer,
    {
      tiff: true,
      ifd0: true,
      exif: true,
      gps: true,
      xmp: true,
      translateValues: true,
    } as unknown as Record<string, unknown>
  );

  const gpsData = await exifr.gps(buffer).catch(() => null);

  const capturedAt =
    parseExifDate(data?.DateTimeOriginal) ||
    parseExifDate(data?.CreateDate) ||
    parseExifDate(data?.ModifyDate);

  const latitude =
    gpsData?.latitude ??
    normalizeCoordinate(data?.GPSLatitude) ??
    normalizeCoordinate(data?.latitude) ??
    normalizeCoordinate(data?.Latitude);
  const longitude =
    gpsData?.longitude ??
    normalizeCoordinate(data?.GPSLongitude) ??
    normalizeCoordinate(data?.longitude) ??
    normalizeCoordinate(data?.Longitude);

  const latitudeRef = data?.GPSLatitudeRef;
  const longitudeRef = data?.GPSLongitudeRef;

  const signedLatitude =
    latitude != null && latitudeRef === "S" ? -Math.abs(latitude) : latitude;
  const signedLongitude =
    longitude != null && longitudeRef === "W" ? -Math.abs(longitude) : longitude;

  const deviceMake = data?.Make ? String(data.Make).trim() : "";
  const deviceModel = data?.Model ? String(data.Model).trim() : "";
  const device = `${deviceMake} ${deviceModel}`.trim();

  const timeAvailable = Boolean(capturedAt);
  const gpsAvailable = signedLatitude != null && signedLongitude != null;
  const deviceAvailable = Boolean(device);

  const completeness = timeAvailable && gpsAvailable && deviceAvailable
    ? "Complete"
    : timeAvailable || gpsAvailable || deviceAvailable
      ? "Partial"
      : "Missing";

  return {
    captureTime: capturedAt ? formatDateTime(capturedAt) : null,
    gps: {
      latitude: signedLatitude ?? null,
      longitude: signedLongitude ?? null,
    },
    device: device || null,
    completeness,
  };
};
