"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiError,
  fetchStats,
  fetchSubmissions,
  type Stats,
  type SubmissionQuery,
} from "./api";
import type { HistoryEntry } from "./types";

export type SubmissionsState = {
  submissions: HistoryEntry[];
  stats: Stats;
  loading: boolean;
  /** True only on the very first load, so refetches don't flash skeletons. */
  initialLoading: boolean;
  error: string | null;
  refresh: () => void;
  /** Inserts a record locally so the list updates without a round trip. */
  prepend: (entry: HistoryEntry) => void;
  remove: (id: string) => void;
};

const EMPTY_STATS: Stats = {
  total: 0,
  verified: 0,
  suspicious: 0,
  reused: 0,
  students: 0,
};

const LOCAL_STORAGE_KEY = "provenance_submissions_cache_v1";

const getCachedSubmissions = (): HistoryEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCachedSubmissions = (entries: HistoryEntry[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
  } catch {
    // ignore
  }
};

const computeStatsFromEntries = (entries: HistoryEntry[]): Stats => {
  const verified = entries.filter((e) => e.status === "Verified").length;
  const suspicious = entries.filter((e) => e.status === "Suspicious").length;
  const reused = entries.filter((e) => e.status === "Reused").length;
  return {
    total: entries.length,
    verified,
    suspicious,
    reused,
    students: 1,
  };
};

/**
 * Loads the ledger and its counts together with offline localStorage persistence.
 */
export const useSubmissions = (query: SubmissionQuery = {}): SubmissionsState => {
  const [submissions, setSubmissions] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const { status, q, take } = query;
  const requestId = useRef(0);

  // Load from local storage on mount
  useEffect(() => {
    const cached = getCachedSubmissions();
    if (cached.length > 0) {
      setSubmissions(cached);
      setStats(computeStatsFromEntries(cached));
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = ++requestId.current;
    let cancelled = false;

    setLoading(true);

    const run = async () => {
      try {
        const [list, counts] = await Promise.all([
          fetchSubmissions({ status, q, take }),
          fetchStats(),
        ]);
        if (cancelled || id !== requestId.current) return;
        setSubmissions(list.submissions);
        setStats(counts);
        saveCachedSubmissions(list.submissions);
        setError(null);
      } catch (caught) {
        if (cancelled || id !== requestId.current) return;
        // If unauthenticated or backend fails, keep cached items and compute stats
        const cached = getCachedSubmissions();
        if (cached.length > 0) {
          setSubmissions(cached);
          setStats(computeStatsFromEntries(cached));
        }
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Could not load submissions."
        );
      } finally {
        if (!cancelled && id === requestId.current) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [status, q, take, nonce]);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  const prepend = useCallback((entry: HistoryEntry) => {
    setSubmissions((current) => {
      const next = [entry, ...current.filter((item) => item.id !== entry.id)];
      saveCachedSubmissions(next);
      return next;
    });
    setStats((current) => ({
      total: (current?.total ?? 0) + 1,
      verified: (current?.verified ?? 0) + (entry.status === "Verified" ? 1 : 0),
      suspicious: (current?.suspicious ?? 0) + (entry.status === "Suspicious" ? 1 : 0),
      reused: (current?.reused ?? 0) + (entry.status === "Reused" ? 1 : 0),
      students: current?.students ?? 1,
    }));
  }, []);

  const remove = useCallback((id: string) => {
    setSubmissions((current) => {
      const next = current.filter((entry) => entry.id !== id);
      saveCachedSubmissions(next);
      const target = current.find((entry) => entry.id === id);
      if (target) {
        setStats((counts) => ({
          ...counts,
          total: Math.max(0, (counts?.total ?? 0) - 1),
          verified: Math.max(0, (counts?.verified ?? 0) - (target.status === "Verified" ? 1 : 0)),
          suspicious: Math.max(0, (counts?.suspicious ?? 0) - (target.status === "Suspicious" ? 1 : 0)),
          reused: Math.max(0, (counts?.reused ?? 0) - (target.status === "Reused" ? 1 : 0)),
        }));
      }
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      submissions,
      stats,
      loading,
      initialLoading,
      error,
      refresh,
      prepend,
      remove,
    }),
    [submissions, stats, loading, initialLoading, error, refresh, prepend, remove]
  );
};

/** Debounces a fast-changing value */
export const useDebounced = <T,>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
