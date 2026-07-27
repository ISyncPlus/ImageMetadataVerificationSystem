import type { HistoryEntry } from "./types";

const STORAGE_KEY = "ivs-history";
const HISTORY_EVENT = "imvs-history-changed";

const notifyHistoryChanged = () => {
  window.dispatchEvent(new Event(HISTORY_EVENT));
};

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

const parseHistory = (raw: string | null): HistoryEntry[] => {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed.map(sanitizeEntry) : [];
  } catch {
    return [];
  }
};

export const loadHistory = (): HistoryEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return parseHistory(window.localStorage.getItem(STORAGE_KEY));
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
      notifyHistoryChanged();
      return;
    }
    working = working.slice(0, -1);
  }

  const withoutPreviews = items.map((entry) => ({ ...entry, previewUrl: "" }));
  if (tryPersist(withoutPreviews)) {
    notifyHistoryChanged();
  } else {
    console.warn("Unable to save verification history to localStorage.");
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    notifyHistoryChanged();
  } catch (error) {
    console.warn("Unable to clear history from localStorage.", error);
  }
};

/* ---- external-store bindings (for useSyncExternalStore) ---- */

const EMPTY_HISTORY: HistoryEntry[] = [];
let historyCacheRaw: string | null | undefined;
let historyCache: HistoryEntry[] = EMPTY_HISTORY;

export const getHistorySnapshot = (): HistoryEntry[] => {
  if (typeof window === "undefined") {
    return EMPTY_HISTORY;
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== historyCacheRaw) {
    historyCacheRaw = raw;
    historyCache = parseHistory(raw);
  }
  return historyCache;
};

export const getServerHistorySnapshot = (): HistoryEntry[] => EMPTY_HISTORY;

export const subscribeToHistory = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(HISTORY_EVENT, callback);
  };
};
