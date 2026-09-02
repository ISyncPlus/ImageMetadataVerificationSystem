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

/**
 * Loads the ledger and its counts together.
 *
 * Counts come from the API rather than being reduced from the rows on screen:
 * the list is paginated and filtered, so counting it locally would report the
 * page, not the ledger.
 */
export const useSubmissions = (query: SubmissionQuery = {}): SubmissionsState => {
  const [submissions, setSubmissions] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const { status, q, take } = query;

  // A stale response from a superseded query must not overwrite a newer one.
  const requestId = useRef(0);

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
        setError(null);
      } catch (caught) {
        if (cancelled || id !== requestId.current) return;
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
    setSubmissions((current) => [entry, ...current]);
    setStats((current) => ({
      total: (current?.total ?? 0) + 1,
      verified: (current?.verified ?? 0) + (entry.status === "Verified" ? 1 : 0),
      suspicious: (current?.suspicious ?? 0) + (entry.status === "Suspicious" ? 1 : 0),
      reused: (current?.reused ?? 0) + (entry.status === "Reused" ? 1 : 0),
      students: current?.students ?? 0,
    }));
  }, []);

  const remove = useCallback((id: string) => {
    setSubmissions((current) => {
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
      return current.filter((entry) => entry.id !== id);
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

/** Debounces a fast-changing value — used so typing doesn't fire a request per key. */
export const useDebounced = <T,>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
