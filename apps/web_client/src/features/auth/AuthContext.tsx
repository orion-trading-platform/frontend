import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api, { setUnauthorizedHandler, attemptRefresh } from "./api";

export interface AuthUser {
  user_id: number;
  email: string;
  created_at: string;
  has_password: boolean;
  profile_picture_url?: string;
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

/** Maximum time (ms) to wait for session restore before giving up. */
const SESSION_RESTORE_TIMEOUT = 10_000;

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Register the unauthorized handler so forceLogout in api.ts goes through React Router.
  useEffect(() => {
    const handler = () => {
      setCurrentUser(null);
      navigate("/login", { replace: true });
    };
    setUnauthorizedHandler(handler);
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

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
    const newToken = await attemptRefresh();
    if (!newToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loggedInUserEmail");
      setCurrentUser(null);
    }
    return newToken !== null;
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
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      setCurrentUser(null);
      setIsLoading(false);
    }, SESSION_RESTORE_TIMEOUT);

    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (!timedOut) {
          clearTimeout(timeout);
          setIsLoading(false);
        }
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
      if (!timedOut) {
        clearTimeout(timeout);
        setCurrentUser(user);
        setIsLoading(false);
      }
    };
    init();

    return () => {
      timedOut = true; // prevent in-flight init() from setting state after cleanup
      clearTimeout(timeout);
    };
  }, [fetchCurrentUser, refreshToken]);

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

/** Redirects unauthenticated users to /login. Renders nothing while session is restoring. */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
