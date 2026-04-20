import { useAccounts, AccountInfo } from "./useAccounts";

const SELECTED_ACCOUNT_KEY = "selectedAccountId";

export function useAccount(): { account: AccountInfo | null; isLoading: boolean } {
  const { accounts, isLoading } = useAccounts();
  const selectedId = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  const account =
    accounts.find((a) => String(a.account_id) === selectedId) ??
    accounts[0] ??
    null;
  return { account, isLoading };
}

export function setSelectedAccountId(accountId: string | number): void {
  localStorage.setItem(SELECTED_ACCOUNT_KEY, String(accountId));
}
