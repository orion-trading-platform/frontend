import { useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "./api";

/**
 * Auth-team-specific actions (login, register, forgot/reset password).
 * Only used inside features/auth/ components — not exported via index.ts.
 */
export function useAuthActions() {
  const { setTokens } = useAuth();

  const register = useCallback(
    async (email: string, password: string) => {
      await api.post("/auth/register", { email, password });
      const res = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token } = res.data;
      await setTokens(access_token, refresh_token);
    },
    [setTokens]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token } = res.data;
      await setTokens(access_token, refresh_token);
    },
    [setTokens]
  );

  const loginWithGoogle = useCallback(
    async (googleAccessToken: string) => {
      const res = await api.post("/auth/login/google", {
        google_access_token: googleAccessToken,
      });
      const { access_token, refresh_token } = res.data;
      await setTokens(access_token, refresh_token);
    },
    [setTokens]
  );

  const forgotPassword = useCallback(async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await api.post("/auth/reset-password", { token, new_password: newPassword });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }, []);

  return { register, login, loginWithGoogle, forgotPassword, resetPassword, changePassword };
}
