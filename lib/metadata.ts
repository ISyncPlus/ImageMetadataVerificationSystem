import exifr from "exifr";
import type { MetadataResult } from "./types";

type ExifValue = number | { numerator: number; denominator: number };

const toNumber = (value: ExifValue): number => {
  if (typeof value === "number") {
    return value;
  }
  return value.numerator / value.denominator;
};

const normalizeCoordinate = (value: unknown): number | null => {
  if (typeof value === "number") {
    return value;
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
    gpsData?.latitude ?? normalizeCoordinate(data?.GPSLatitude);
  const longitude =
    gpsData?.longitude ?? normalizeCoordinate(data?.GPSLongitude);

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
