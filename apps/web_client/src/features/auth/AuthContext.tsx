import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "./api";

export interface AuthUser {
  user_id: number;
  email: string;
  created_at: string;
}

interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Call after a successful login/register to store tokens and load the user. */
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  /** Refresh the access token using the stored refresh token. Returns true on success. */
  refreshToken: () => Promise<boolean>;
  /** Log out: revoke the refresh token, clear local storage, reset state. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const res = await api.get("/auth/me");
      return res.data as AuthUser;
    } catch {
      return null;
    }
  }, []);

  /** Store tokens, set the axios default header, and fetch the current user. */
  const setTokens = useCallback(
    async (accessToken: string, refreshToken: string) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      if (user) {
        localStorage.setItem("loggedInUserEmail", user.email);
      }
    },
    [fetchCurrentUser]
  );

  /** Attempt to refresh the access token. Returns true if successful. */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const rt = localStorage.getItem("refreshToken");
    if (!rt) return false;
    try {
      const res = await api.post("/auth/refresh", { refresh_token: rt });
      const { access_token, refresh_token } = res.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      return true;
    } catch {
      // Refresh failed — tokens are invalid.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loggedInUserEmail");
      setCurrentUser(null);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    const rt = localStorage.getItem("refreshToken");
    if (rt) {
      try {
        await api.post("/auth/logout", { refresh_token: rt });
      } catch {
        // Best-effort — if it fails the token expires anyway.
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("loggedInUserEmail");
    setCurrentUser(null);
  }, []);

  // On mount, check if the user has an existing session.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      let user = await fetchCurrentUser();
      if (!user) {
        // Access token expired — try refresh.
        const refreshed = await refreshToken();
        if (refreshed) {
          user = await fetchCurrentUser();
        }
      }
      setCurrentUser(user);
      setIsLoading(false);
    };
    init();
  }, [fetchCurrentUser, refreshToken]);

  // Axios response interceptor: auto-refresh on 401 and retry the request.
  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/")
        ) {
          originalRequest._retry = true;
          const refreshed = await refreshToken();
          if (refreshed) {
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(id);
    };
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        setTokens,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
