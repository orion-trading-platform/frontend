import { useAccounts, AccountInfo } from "./useAccounts";

export function useAccount(): { account: AccountInfo | null; isLoading: boolean } {
  const { accounts, isLoading } = useAccounts();
  return { account: accounts[0] ?? null, isLoading };
}
