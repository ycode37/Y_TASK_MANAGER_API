import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Attach the bearer token to every request, and short-circuit locally if we
// already know the token has expired. The backend's JWT lives for 5 minutes
// and any missing/expired token currently reaches the client as an opaque
// 500 ("Internal Server Error") because the auth middleware throws instead of
// returning 401. Catching expiry client-side, before the request goes out,
// means the person sees "your session ended" instead of a raw server error.
api.interceptors.request.use((config) => {
  const { token, expiresAt } = useAuthStore.getState();

  if (token && expiresAt && Date.now() >= expiresAt) {
    useAuthStore.getState().expireSession();
    return Promise.reject(new axios.Cancel("SESSION_EXPIRED"));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const hadToken = Boolean(useAuthStore.getState().token);

    // A protected route failing at all while we believe we're logged in is,
    // in this backend, almost always an expired/invalid token rather than a
    // real server fault (see note above) — so treat it as a session issue.
    if (hadToken && (status === 401 || status === 403 || status === 500)) {
      useAuthStore.getState().expireSession();
    }
    return Promise.reject(error);
  },
);

/** Pull the most useful human-readable message out of this backend's
 * inconsistent error shapes (plain message, zod `errors`, mongoose
 * `errors`, etc.), and clean up the couple of known rough edges. */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.message === "SESSION_EXPIRED") {
    return "Your session ended. Please sign in again.";
  }

  const data = error?.response?.data;
  if (!data) {
    return error?.message ? fallback : fallback;
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    if (first?.message) return first.message;
  }

  if (typeof data.message === "string") {
    if (data.message === "Invalid Credetnials") return "Invalid email or password.";
    return data.message;
  }

  return fallback;
}

export const AuthAPI = {
  register: (payload) => api.post("/user/register", payload),
  login: (payload) => api.post("/user/login", payload),
};

export const TaskAPI = {
  list: (params) => api.get("/api/tasks", { params }),
  create: (taskName) => api.post("/api/create", { taskName }),
  update: (id, changes) => api.put(`/api/update/${id}`, changes),
  remove: (id) => api.delete(`/api/delete/${id}`),
};
