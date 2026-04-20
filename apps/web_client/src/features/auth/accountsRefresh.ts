/** Dispatched after balance-changing actions so all `useAccounts` hooks refetch. */
export const ACCOUNTS_REFRESH_EVENT = "app:accounts-refresh";

export function emitAccountsRefresh(): void {
  window.dispatchEvent(new CustomEvent(ACCOUNTS_REFRESH_EVENT));
}
