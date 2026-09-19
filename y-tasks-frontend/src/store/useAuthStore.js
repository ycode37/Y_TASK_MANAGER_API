import { create } from "zustand";

const STORAGE_KEY = "y-tasks.session";

// The backend issues tokens with a 5-minute lifetime and doesn't expose a
// decode-free way to read that expiry, so we record it ourselves at login
// time and treat it as the source of truth on the client.
const SESSION_LENGTH_MS = 5 * 60 * 1000;

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const stored = loadStoredSession();

export const useAuthStore = create((set, get) => ({
  token: stored?.token ?? null,
  user: stored?.user ?? null,
  expiresAt: stored?.expiresAt ?? null,
  // "expired" (as opposed to plain logged-out) drives the session-expired
  // modal instead of silently dropping the person back at the login screen.
  sessionExpired: false,

  login: (token, user) => {
    const expiresAt = Date.now() + SESSION_LENGTH_MS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user, expiresAt }));
    set({ token, user, expiresAt, sessionExpired: false });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, expiresAt: null, sessionExpired: false });
  },

  expireSession: () => {
    if (!get().token) return;
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, expiresAt: null, sessionExpired: true });
  },

  dismissExpiredNotice: () => set({ sessionExpired: false }),

  msRemaining: () => {
    const { expiresAt } = get();
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - Date.now());
  },
}));
