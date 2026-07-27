"use client";

import { useSyncExternalStore } from "react";
import {
  getHistorySnapshot,
  getServerHistorySnapshot,
  subscribeToHistory,
} from "./storage";
import type { HistoryEntry } from "./types";

/**
 * Reactive verification history backed by localStorage.
 * Updates automatically after each save — including across browser tabs,
 * so a lecturer dashboard reflects new student submissions live.
 */
export const useHistory = (): HistoryEntry[] =>
  useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    getServerHistorySnapshot
  );
