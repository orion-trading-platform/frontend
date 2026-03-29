# Auth Feature

## For other teams

```tsx
import { AuthProvider, useAuth, ProtectedRoute, api } from "@/features/auth";
import type { AuthUser } from "@/features/auth";
```

### `<AuthProvider>`

Wraps the app root (`App.tsx`). Handles token storage in localStorage, auto-refresh on 401, and session restore on page load.

### `useAuth()`

```tsx
const { currentUser, isAuthenticated, isLoading, setTokens, refreshToken, logout } = useAuth();
```

| Field | Type | Description |
|---|---|---|
| `currentUser` | `AuthUser \| null` | Current user (`user_id`, `email`, `created_at`) or `null` |
| `isAuthenticated` | `boolean` | `true` if user has a valid session |
| `isLoading` | `boolean` | `true` during initial session check — show a spinner, not the login page |
| `setTokens` | `(access, refresh) => Promise` | Store tokens and load user — call after login/register |
| `refreshToken` | `() => Promise<boolean>` | Manually refresh the access token; returns `true` on success |
| `logout` | `() => Promise` | Revoke refresh token, clear localStorage, reset state |

### `api` (axios instance)

Pre-configured axios instance with:
- `baseURL` set to `VITE_BACKEND_URL`
- Request interceptor: auto-attaches `Authorization: Bearer <token>` header
- Response interceptor: auto-refreshes on 401 and retries the failed request; on permanent failure clears localStorage and navigates to `/login`

**Use this for all backend requests** — auth headers are handled automatically:

```tsx
import { api } from "@/features/auth";

const res = await api.get("/holdings/123");
```

> **Note:** Any request made with this `api` instance that returns a 401 (and cannot be recovered by refresh) will trigger a forced logout and redirect to `/login`. Do not use it for optional/unauthenticated requests.

### `AuthUser` type

```typescript
interface AuthUser {
  user_id: number;
  email: string;
  created_at: string;
}
```

### `<ProtectedRoute>`

Wraps any route that requires authentication. Renders nothing while the session is restoring, then redirects to `/login` if unauthenticated.

```tsx
import { ProtectedRoute } from "@/features/auth";

<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
```

### Common patterns

**Display current user:**
```tsx
const { currentUser } = useAuth();
return <span>{currentUser?.email}</span>;
```

**Pass user ID to an API call:**
```tsx
const { currentUser } = useAuth();
const res = await api.get(`/holdings/${currentUser?.user_id}`);
```

---

## For auth team members

Internal files (beside pages) **not** exported via `index.ts`:

| File | Purpose |
|---|---|
| `useAuthActions.ts` | Auth-only actions: `login`, `register`, `loginWithGoogle`, `forgotPassword`, `resetPassword`, `changePassword` |
| `AuthContext.tsx` | React context, provider, token lifecycle, 401 interceptor |

### `useAuthActions()`

Currently only used inside `Login.tsx` and `ResetPassword.tsx`. Wraps the raw `/auth/*` API calls:

```tsx
const { register, login, loginWithGoogle, forgotPassword, resetPassword, changePassword } = useAuthActions();
```

| Action | Endpoint | Notes |
|---|---|---|
| `register(email, pw)` | `POST /auth/register` then `POST /auth/login` | Auto-logs in after registration |
| `login(email, pw)` | `POST /auth/login` | Stores tokens via `setTokens` |
| `loginWithGoogle(token)` | `POST /auth/login/google` | Takes Google OAuth access token |
| `forgotPassword(email)` | `POST /auth/forgot-password` | Always returns 202 (silent) |
| `resetPassword(token, pw)` | `POST /auth/reset-password` | Token from the reset email link |
| `changePassword(current, new)` | `POST /auth/change-password` | Requires valid session |
