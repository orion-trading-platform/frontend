import axios from "axios";

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

export default api;
