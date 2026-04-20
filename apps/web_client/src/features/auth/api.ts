import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/** Pre-configured axios instance for all auth/backend requests. */
const api = axios.create({ baseURL: API_URL });

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// 401 interceptor with refresh-queue (prevents concurrent refresh races)
// ---------------------------------------------------------------------------

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(token: string | null, error: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    token ? resolve(token) : reject(error);
  });
  pendingQueue = [];
}

// Dedicated client for the refresh call — no auth or 401 interceptors,
// so a failed refresh doesn't re-enter the interceptor and cause an infinite loop.
const refreshClient = axios.create({ baseURL: API_URL });

/** Attempt a single token refresh. Returns the new access token or null. */
export async function attemptRefresh(): Promise<string | null> {
  const rt = localStorage.getItem("refreshToken");
  if (!rt) return null;
  try {
    const res = await refreshClient.post("/auth/refresh", { refresh_token: rt });
    const { access_token, refresh_token } = res.data;
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    return access_token;
  } catch {
    return null;
  }
}

// Registered by AuthProvider so logout can go through React Router instead of hard navigation.
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

/** Force a full logout: clear storage and invoke the registered handler (or hard-redirect as fallback). */
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("loggedInUserEmail");
  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else {
    window.location.href = "/"; //NOTE: currently routes to Login but should be LandingPage in final design
  }
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    // Only intercept 401s on non-auth endpoints that haven't already been retried.
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    // First 401 — start the refresh.
    isRefreshing = true;
    const newToken = await attemptRefresh();

    if (newToken) {
      processQueue(newToken);
      isRefreshing = false;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    // Refresh failed permanently — force logout.
    processQueue(null, error);
    isRefreshing = false;
    forceLogout();
    return Promise.reject(error);
  }
);

export default api;

// ---------------------------------------------------------------------------
// Trading Engine client
// ---------------------------------------------------------------------------

const TRADING_ENGINE_URL =
  import.meta.env.VITE_TRADING_ENGINE_URL ?? "http://localhost:8002";

export const tradingApi = axios.create({ baseURL: TRADING_ENGINE_URL });

tradingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
