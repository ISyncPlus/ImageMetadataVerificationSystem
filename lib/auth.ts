export type UserRole = "student" | "lecturer";

export type Session = {
  role: UserRole;
  name: string;
  /** Registration number (students) or staff ID (lecturers). */
  identifier: string;
  signedInAt: string;
};

const SESSION_KEY = "imvs-session";

export const loadSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
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

export const saveSession = (session: Session) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
  } catch {
    // ignore
  }
};

export const dashboardPathFor = (role: UserRole): string =>
  role === "student" ? "/student" : "/lecturer";
