# Auth Feature

## For other teams

```tsx
import { AuthProvider, useAuth, useAccount, useAccounts, ProtectedRoute, api } from "@/features/auth";
import type { AuthUser, AccountInfo } from "@/features/auth";
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

### `useAccount()` and `useAccounts()`

Two hooks are provided depending on how many accounts we support per user (single or multiple). So whichever is the right choice to use depends on our final design and should be agreed upon ASAP. `useAccounts()` provides the full accounts list and thus provides more freedom. `useAccount()` is simpler and just assumes a single account, wrapping `useAccounts()` and taking `accounts[0]` (or `null` if empty) as that account.

#### `useAccount()` — single account

```tsx
const { account, isLoading } = useAccount();
```

| Field | Type | Description |
|---|---|---|
| `account` | `AccountInfo \| null` | The user's account, or `null` while loading or if the user has no accounts |
| `isLoading` | `boolean` | `true` while the request is in flight |

#### `useAccounts()` — full list

```tsx
const { accounts, isLoading } = useAccounts();
```

| Field | Type | Description |
|---|---|---|
| `accounts` | `AccountInfo[]` | All accounts belonging to the current user |
| `isLoading` | `boolean` | `true` while the request is in flight |

Both call `GET /auth/me/accounts` (token injected automatically). Use these to resolve `account_id` for any downstream request (e.g. posting transactions, fetching holdings).

### `AccountInfo` type

```typescript
interface AccountInfo {
  account_id: number;
  balance: string;
  currency: string;
  version: number;
}
```

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

**Fetch data for the current account (with stale closure guard):**
```tsx
const { account, isLoading } = useAccount();

useEffect(() => {
  if (!account) return;
  let ignore = false;
  api.get(`/holdings/${account.account_id}`).then(res => {
    if (!ignore) {
      // handle res.data
    }
  });
  return () => { ignore = true; };
}, [account]);
```

**Render a list of accounts (multi-account scenario):**
```tsx
const { accounts, isLoading } = useAccounts();
if (isLoading) return null;
return (
  <>
    {accounts.map(a => (
      <div key={a.account_id}>
        {a.account_id} — {a.currency} {a.balance}
      </div>
    ))}
  </>
);
```

**Let the user pick an account before acting:**
```tsx
const { accounts, isLoading } = useAccounts();
const [selectedId, setSelectedId] = useState<number | null>(null);

if (isLoading) return null;
return (
  <>
    {accounts.map(a => (
      <button key={a.account_id} onClick={() => setSelectedId(a.account_id)}>
        Account {a.account_id}
      </button>
    ))}
    {selectedId !== null && (
      // render whatever needs the selected account_id
      <div>Selected: {selectedId}</div>
    )}
  </>
);
```

---

## For auth team members

Internal files (beside pages) **not** exported via `index.ts`:

| File | Purpose |
|---|---|
| `useAuthActions.ts` | Auth-only actions: `login`, `register`, `loginWithGoogle`, `forgotPassword`, `resetPassword`, `changePassword`, `deleteUser` |
| `AuthContext.tsx` | React context, provider, token lifecycle, 401 interceptor |
| `LogoutConfirmationModal.tsx` | Confirmation dialog for logout — used in ProfileModal, ledger, and ordering pages |
| `DeleteUserConfirmationModal.tsx` | Confirmation dialog for account deletion — used in ProfileModal |

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
| `deleteUser()` | `DELETE /auth/me` | Permanently deletes the authenticated user's account |
