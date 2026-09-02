/**
 * What counts as a usable coordinate.
 *
 * Extraction and verification must agree on this, and both must be stricter
 * than "is a finite number". Two failure modes make that necessary, and both
 * were observed in testing rather than imagined:
 *
 *  1. **Null Island.** Metadata strippers routinely leave the GPS IFD in place
 *     and zero its rationals. The file then reads as latitude 0, longitude 0 —
 *     a real point in the Gulf of Guinea, roughly 700km south of Nigeria, and
 *     a perfectly finite number. Treating it as a location turns the single
 *     most common evidence of *stripping* into evidence of *presence*, which
 *     is the exact inversion this system exists to prevent.
 *
 *  2. **Out of range.** A corrupted or misread rational can yield a latitude
 *     of 300. It is finite; it is not a place on Earth.
 */

/** Anything inside this many degrees of (0, 0) is treated as absent. */
const NULL_ISLAND_EPSILON = 1e-7;

export const isUsableCoordinate = (
  latitude: number | null | undefined,
  longitude: number | null | undefined
): latitude is number =>
  latitude != null &&
  longitude != null &&
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  Math.abs(latitude) <= 90 &&
  Math.abs(longitude) <= 180 &&
  !(
    Math.abs(latitude) < NULL_ISLAND_EPSILON &&
    Math.abs(longitude) < NULL_ISLAND_EPSILON
  );

/** Metres per degree of latitude, near enough for a proximity check. */
const METRES_PER_DEGREE = 111_320;

/**
 * Great-circle distance in metres. Used to compare an attested position
 * against the coordinates the photograph itself claims.
 */
export const distanceMetres = (
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const meanLat = toRad((aLat + bLat) / 2);
  const dLat = (bLat - aLat) * METRES_PER_DEGREE;
  const dLon = (bLon - aLon) * METRES_PER_DEGREE * Math.cos(meanLat);
  return Math.sqrt(dLat * dLat + dLon * dLon);
};

/** "6.24831° N, 7.11472° E" — the form used everywhere coordinates are shown. */
export const formatCoordinatePair = (
  latitude: number,
  longitude: number
): string =>
  `${Math.abs(latitude).toFixed(5)}° ${latitude >= 0 ? "N" : "S"}, ` +
  `${Math.abs(longitude).toFixed(5)}° ${longitude >= 0 ? "E" : "W"}`;

/** "±12 m" — an accuracy radius, or null when the device did not report one. */
export const formatAccuracy = (metres: number | null): string | null =>
  metres == null || !Number.isFinite(metres)
    ? null
    : metres < 1000
      ? `±${Math.round(metres)} m`
      : `±${(metres / 1000).toFixed(1)} km`;
