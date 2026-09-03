"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiError,
  fetchStats,
  fetchSubmissions,
  type Stats,
  type SubmissionQuery,
} from "./api";
import { useSession } from "./auth-client";
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

const LOCAL_STORAGE_PREFIX = "provenance_submissions_cache_v1:";

/**
 * The cache key is namespaced by user id. It used to be a single global key
 * shared by every account that ever signed in on the browser — which meant
 * signing in as a second student on a shared/lab machine would show the
 * first student's cached submissions on load, and then persist a merge of
 * both accounts' entries back to disk. Every read/write below requires a
 * concrete userId specifically so that mistake can't come back.
 */
const getCachedSubmissions = (userId: string): HistoryEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCachedSubmissions = (userId: string, entries: HistoryEntry[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      LOCAL_STORAGE_PREFIX + userId,
      JSON.stringify(entries.slice(0, 50))
    );
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
 *
 * The cache exists purely as a fallback for when the network or the API is
 * briefly unreachable — it is never allowed to be the reason a submission
 * appears on screen while the server is reachable. Every read and write of
 * it is keyed by the *current* signed-in user, and a successful fetch always
 * replaces what's shown with exactly what the server returned (never merged
 * with whatever happened to be sitting in the cache).
 */
export const useSubmissions = (query: SubmissionQuery = {}): SubmissionsState => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [submissions, setSubmissions] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const { status, q, take } = query;
  const requestId = useRef(0);
  const lastUserId = useRef<string | null>(null);

  // The moment the signed-in user changes (including signing out), drop
  // whatever the previous account's data was out of memory immediately —
  // don't wait for the next fetch to overwrite it. This is what used to let
  // a second account, on the same browser, render the first account's rows
  // for the brief window before its own fetch resolved.
  if (userId !== lastUserId.current) {
    lastUserId.current = userId;
    if (submissions.length > 0) setSubmissions([]);
    if (stats !== EMPTY_STATS) setStats(EMPTY_STATS);
  }

  // Show the current user's cached submissions immediately on mount (or the
  // moment they sign in), so the dashboard isn't empty while the first fetch
  // is in flight.
  useEffect(() => {
    if (!userId) return;
    const cached = getCachedSubmissions(userId);
    if (cached.length > 0) {
      setSubmissions(cached);
      setStats(computeStatsFromEntries(cached));
      setInitialLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setInitialLoading(false);
      return;
    }

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

        // The server is reachable and answered as this user — its list is
        // the whole truth for this view, not "server plus whatever was
        // cached." Trusting the cache here is exactly how one account's
        // leftovers used to bleed into another's.
        setSubmissions(list.submissions);
        setStats(counts);
        saveCachedSubmissions(userId, list.submissions);
        setError(null);
      } catch (caught) {
        if (cancelled || id !== requestId.current) return;
        // Network/API is unreachable — fall back to this same user's last
        // known-good cache rather than showing nothing.
        const cached = getCachedSubmissions(userId);
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
  }, [userId, status, q, take, nonce]);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  const prepend = useCallback(
    (entry: HistoryEntry) => {
      setSubmissions((current) => {
        const next = [entry, ...current.filter((item) => item.id !== entry.id)];
        if (userId) saveCachedSubmissions(userId, next);
        setStats(computeStatsFromEntries(next));
        return next;
      });
    },
    [userId]
  );

  const remove = useCallback(
    (id: string) => {
      setSubmissions((current) => {
        const next = current.filter((entry) => entry.id !== id);
        if (userId) saveCachedSubmissions(userId, next);
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
    },
    [userId]
  );

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
