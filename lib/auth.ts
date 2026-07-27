export type UserRole = "student" | "lecturer";

export type Session = {
  role: UserRole;
  name: string;
  /** Registration number (students) or staff ID (lecturers). */
  identifier: string;
  signedInAt: string;
};

const SESSION_KEY = "imvs-session";
const SESSION_EVENT = "imvs-session-changed";

const parseSession = (raw: string | null): Session | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Session;
    if (
      (parsed.role === "student" || parsed.role === "lecturer") &&
      typeof parsed.name === "string" &&
      parsed.name.trim() &&
      typeof parsed.identifier === "string" &&
      parsed.identifier.trim()
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const notifySessionChanged = () => {
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const loadSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parseSession(window.localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (session: Session) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySessionChanged();
  } catch {
    // Session persistence is best-effort in the prototype.
  }
};

export const clearSession = () => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(SESSION_KEY);
    notifySessionChanged();
  } catch {
    // ignore
  }
};

/* ---- external-store bindings (for useSyncExternalStore) ---- */

let sessionCacheRaw: string | null | undefined;
let sessionCache: Session | null = null;

export const getSessionSnapshot = (): Session | null => {
  if (typeof window === "undefined") {
    return null;
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SESSION_KEY);
  } catch {
    raw = null;
  }
  if (raw !== sessionCacheRaw) {
    sessionCacheRaw = raw;
    sessionCache = parseSession(raw);
  }
  return sessionCache;
};

export const getServerSessionSnapshot = (): Session | null => null;

export const subscribeToSession = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_EVENT, callback);
  };
};

export const dashboardPathFor = (role: UserRole): string =>
  role === "student" ? "/student" : "/lecturer";
