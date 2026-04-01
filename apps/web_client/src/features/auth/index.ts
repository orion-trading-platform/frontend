// Public API of the auth feature — this is all other teams should import.
export { AuthProvider, useAuth, ProtectedRoute } from "./AuthContext";
export type { AuthUser } from "./AuthContext";
// NOTE: api carries a 401→forceLogout side effect. On a permanent refresh failure it clears
// localStorage and navigates to /login. Only import this if that behavior is acceptable.
export { default as api } from "./api";
