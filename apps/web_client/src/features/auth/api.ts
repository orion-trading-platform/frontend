import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/** Pre-configured axios instance for all auth/backend requests. */
const api = axios.create({ baseURL: API_URL });

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
// The optional reason is forwarded to the login page via router state.
let unauthorizedHandler: ((reason?: string) => void) | null = null;

export function setUnauthorizedHandler(handler: ((reason?: string) => void) | null) {
  unauthorizedHandler = handler;
}

// Registered by AuthProvider to surface in-flight refresh state to the UI.
let refreshingStateCallback: ((refreshing: boolean) => void) | null = null;

export function setRefreshingStateCallback(cb: ((refreshing: boolean) => void) | null) {
  refreshingStateCallback = cb;
}

function notifyRefreshing(refreshing: boolean) {
  refreshingStateCallback?.(refreshing);
}

/** Force a full logout: clear storage and invoke the registered handler (or hard-redirect as fallback). */
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("loggedInUserEmail");
  if (unauthorizedHandler) {
    unauthorizedHandler("session_expired");
  } else {
    window.location.href = "/";
  }
}

/** Returns true if the JWT access token is expired (or missing/malformed). */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Proactively refresh an expired token before sending the request.
// This eliminates the round-trip 401 when we can determine expiry locally.
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");
  if (!token) return config;

  if (isTokenExpired(token)) {
    if (isRefreshing) {
      // Another request already kicked off a refresh — wait for it.
      token = await new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
    } else {
      isRefreshing = true;
      notifyRefreshing(true);
      const newToken = await attemptRefresh();
      if (newToken) {
        processQueue(newToken);
        token = newToken;
      } else {
        processQueue(null, new Error("Session expired"));
        isRefreshing = false;
        notifyRefreshing(false);
        forceLogout();
        return Promise.reject(new Error("Session expired"));
      }
      isRefreshing = false;
      notifyRefreshing(false);
    }
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    notifyRefreshing(true);
    const newToken = await attemptRefresh();

    if (newToken) {
      processQueue(newToken);
      isRefreshing = false;
      notifyRefreshing(false);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    // Refresh failed permanently — force logout.
    processQueue(null, error);
    isRefreshing = false;
    notifyRefreshing(false);
    forceLogout();
    return Promise.reject(error);
  }
);

export default api;

export async function deleteAccount(accountId: string | number): Promise<void> {
  await api.delete(`/accounts/${accountId}`);
}

/** Exposed for tradingApi, marketApi to trigger the auth expiry flow. */
export function signalSessionExpired() {
  forceLogout();
}

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

tradingApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);
