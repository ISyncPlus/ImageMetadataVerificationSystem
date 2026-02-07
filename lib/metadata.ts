import exifr from "exifr";
import type { MetadataResult } from "./types";

type ExifValue = number | { numerator: number; denominator: number };

const toNumber = (value: ExifValue | string): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (!value || typeof value !== "object") {
    return null;
  }
  if (!value.denominator || !Number.isFinite(value.numerator)) {
    return null;
  }
  const result = value.numerator / value.denominator;
  return Number.isFinite(result) ? result : null;
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

  const numbers = numberMatches
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
  if (numbers.length === 0) {
    return null;
  }

  let coordinate = numbers[0];
  if (numbers.length >= 3) {
    const [deg, min, sec] = numbers;
    coordinate = deg + min / 60 + sec / 3600;
  } else if (numbers.length >= 2) {
    const [deg, min] = numbers;
    coordinate = deg + min / 60;
  }

  if (direction === "S" || direction === "W") {
    coordinate = -Math.abs(coordinate);
  }

  return Number.isFinite(coordinate) ? coordinate : null;
};

const normalizeCoordinate = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
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

  if (Array.isArray(value) && value.length >= 2) {
    const [deg, min, sec] = value as Array<ExifValue | string>;
    const degrees = toNumber(deg);
    const minutes = toNumber(min);
    const seconds = sec != null ? toNumber(sec) : 0;
    if (degrees == null || minutes == null || seconds == null) {
      return null;
    }
    const coordinate = degrees + minutes / 60 + seconds / 3600;
    return Number.isFinite(coordinate) ? coordinate : null;
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

const normalizeFinalCoordinate = (value: number | null): number | null =>
  value != null && Number.isFinite(value) ? value : null;

const normalizeRef = (value: unknown): string | null =>
  typeof value === "string" ? value.toUpperCase() : null;

const getFieldValue = (
  record: Record<string, unknown> | null | undefined,
  keys: string[]
): unknown => {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    if (key in record) {
      const value = record[key];
      if (value != null) {
        return value;
      }
    }
  }

  return null;
};

const pickGpsFields = (record: Record<string, unknown>): Record<string, unknown> => {
  const entries = Object.entries(record).filter(([key]) => {
    const lowerKey = key.toLowerCase();
    return (
      lowerKey.includes("gps") ||
      lowerKey.includes("latitude") ||
      lowerKey.includes("longitude")
    );
  });

  return Object.fromEntries(entries);
};

export type DebugMetadata = {
  gpsData: unknown;
  gpsRecord: Record<string, unknown> | null;
  exifRecord: Record<string, unknown> | null;
  xmpRecord: Record<string, unknown> | null;
  gpsFields: Record<string, unknown>;
};

export const extractDebugMetadata = async (
  buffer: ArrayBuffer
): Promise<DebugMetadata> => {
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
  const dataRecord = (data ?? {}) as Record<string, unknown>;
  const gpsRecord =
    dataRecord.gps && typeof dataRecord.gps === "object"
      ? (dataRecord.gps as Record<string, unknown>)
      : null;
  const exifRecord =
    dataRecord.exif && typeof dataRecord.exif === "object"
      ? (dataRecord.exif as Record<string, unknown>)
      : null;
  const xmpRecord =
    dataRecord.xmp && typeof dataRecord.xmp === "object"
      ? (dataRecord.xmp as Record<string, unknown>)
      : null;

  return {
    gpsData,
    gpsRecord,
    exifRecord,
    xmpRecord,
    gpsFields: pickGpsFields(dataRecord),
  };
};

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
  const dataRecord = (data ?? {}) as Record<string, unknown>;
  const gpsRecord =
    dataRecord.gps && typeof dataRecord.gps === "object"
      ? (dataRecord.gps as Record<string, unknown>)
      : null;
  const exifRecord =
    dataRecord.exif && typeof dataRecord.exif === "object"
      ? (dataRecord.exif as Record<string, unknown>)
      : null;
  const xmpRecord =
    dataRecord.xmp && typeof dataRecord.xmp === "object"
      ? (dataRecord.xmp as Record<string, unknown>)
      : null;

  const capturedAt =
    parseExifDate(data?.DateTimeOriginal) ||
    parseExifDate(data?.CreateDate) ||
    parseExifDate(data?.ModifyDate);

  const latitude =
    normalizeCoordinate(gpsData?.latitude) ??
    normalizeCoordinate(getFieldValue(gpsRecord, ["latitude", "Latitude"])) ??
    normalizeCoordinate(
      getFieldValue(dataRecord, [
        "GPSLatitude",
        "latitude",
        "Latitude",
        "exif:GPSLatitude",
        "xmp:GPSLatitude",
      ])
    ) ??
    normalizeCoordinate(
      getFieldValue(exifRecord, ["GPSLatitude", "latitude", "Latitude"])
    ) ??
    normalizeCoordinate(
      getFieldValue(xmpRecord, ["GPSLatitude", "latitude", "Latitude"])
    );
  const longitude =
    normalizeCoordinate(gpsData?.longitude) ??
    normalizeCoordinate(getFieldValue(gpsRecord, ["longitude", "Longitude"])) ??
    normalizeCoordinate(
      getFieldValue(dataRecord, [
        "GPSLongitude",
        "longitude",
        "Longitude",
        "exif:GPSLongitude",
        "xmp:GPSLongitude",
      ])
    ) ??
    normalizeCoordinate(
      getFieldValue(exifRecord, ["GPSLongitude", "longitude", "Longitude"])
    ) ??
    normalizeCoordinate(
      getFieldValue(xmpRecord, ["GPSLongitude", "longitude", "Longitude"])
    );

  const latitudeRef = normalizeRef(
    getFieldValue(dataRecord, [
      "GPSLatitudeRef",
      "exif:GPSLatitudeRef",
      "xmp:GPSLatitudeRef",
    ]) ?? getFieldValue(exifRecord, ["GPSLatitudeRef"]) ??
    getFieldValue(xmpRecord, ["GPSLatitudeRef"]) ??
    getFieldValue(gpsRecord, ["latitudeRef", "LatitudeRef"])
  );
  const longitudeRef = normalizeRef(
    getFieldValue(dataRecord, [
      "GPSLongitudeRef",
      "exif:GPSLongitudeRef",
      "xmp:GPSLongitudeRef",
    ]) ?? getFieldValue(exifRecord, ["GPSLongitudeRef"]) ??
    getFieldValue(xmpRecord, ["GPSLongitudeRef"]) ??
    getFieldValue(gpsRecord, ["longitudeRef", "LongitudeRef"])
  );

  const signedLatitude =
    latitude != null && latitudeRef === "S"
      ? -Math.abs(latitude)
      : latitude != null && latitudeRef === "N"
        ? Math.abs(latitude)
        : latitude;
  const signedLongitude =
    longitude != null && longitudeRef === "W"
      ? -Math.abs(longitude)
      : longitude != null && longitudeRef === "E"
        ? Math.abs(longitude)
        : longitude;

  const finalLatitude = normalizeFinalCoordinate(signedLatitude ?? null);
  const finalLongitude = normalizeFinalCoordinate(signedLongitude ?? null);

  const deviceMake = data?.Make ? String(data.Make).trim() : "";
  const deviceModel = data?.Model ? String(data.Model).trim() : "";
  const device = `${deviceMake} ${deviceModel}`.trim();

  const timeAvailable = Boolean(capturedAt);
  const gpsAvailable =
    finalLatitude != null && finalLongitude != null;
  const deviceAvailable = Boolean(device);

  const completeness = timeAvailable && gpsAvailable && deviceAvailable
    ? "Complete"
    : timeAvailable || gpsAvailable || deviceAvailable
      ? "Partial"
      : "Missing";

  return {
    captureTime: capturedAt ? formatDateTime(capturedAt) : null,
    gps: {
      latitude: finalLatitude,
      longitude: finalLongitude,
    },
    device: device || null,
    locationName: null,
    completeness,
  };
};
