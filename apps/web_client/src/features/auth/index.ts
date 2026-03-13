// Public API of the auth feature — this is all other teams should import.
export { AuthProvider, useAuth } from "./AuthContext";
export type { AuthUser } from "./AuthContext";
export { default as api } from "./api";
