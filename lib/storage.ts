import type { HistoryEntry } from "./types";

const STORAGE_KEY = "ivs-history";

const normalizeCoordinate = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const sanitizeEntry = (entry: HistoryEntry): HistoryEntry => {
  const latitude = normalizeCoordinate(entry.metadata.gps.latitude);
  const longitude = normalizeCoordinate(entry.metadata.gps.longitude);
  const locationName = entry.metadata.locationName ?? null;

  return {
    ...entry,
    metadata: {
      ...entry.metadata,
      gps: {
        latitude,
        longitude,
      },
      locationName,
      gpsTagsPresent: entry.metadata.gpsTagsPresent ?? false,
    },
  };
};

export const loadHistory = (): HistoryEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed.map(sanitizeEntry) : [];
  } catch {
    return [];
  }
};

const tryPersist = (items: HistoryEntry[]): boolean => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};

/**
 * Saves history while staying within the localStorage quota.
 * If a save fails, progressively drops the oldest entries, and as a
 * last resort strips preview thumbnails, so records are never lost silently.
 */
export const saveHistory = (items: HistoryEntry[]) => {
  if (typeof window === "undefined") {
    return;
  }

  let working = [...items];
  while (working.length > 0) {
    if (tryPersist(working)) {
      return;
    }
    working = working.slice(0, -1);
  }

  const withoutPreviews = items.map((entry) => ({ ...entry, previewUrl: "" }));
  if (!tryPersist(withoutPreviews)) {
    console.warn("Unable to save verification history to localStorage.");
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear history from localStorage.", error);
  }
};
