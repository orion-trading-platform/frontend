import { useState, useEffect, useCallback, useRef } from "react";
import api from "./api";
import { ACCOUNTS_REFRESH_EVENT } from "./accountsRefresh";

export interface AccountInfo {
  /** Bigtable account id (string in API responses). */
  account_id: string;
  balance: string;
  currency: string;
  version: number;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const alive = useRef(true);

  const fetchAccounts = useCallback(async (withLoading: boolean) => {
    if (withLoading) setIsLoading(true);
    try {
      const res = await api.get<AccountInfo[]>("/auth/me/accounts");
      if (!alive.current) return;
      setAccounts(res.data);
      setError(false);
    } catch {
      if (!alive.current) return;
      setError(true);
    } finally {
      if (!alive.current) return;
      if (withLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void fetchAccounts(true);
    const onRefresh = () => {
      void fetchAccounts(false);
    };
    window.addEventListener(ACCOUNTS_REFRESH_EVENT, onRefresh);
    return () => {
      alive.current = false;
      window.removeEventListener(ACCOUNTS_REFRESH_EVENT, onRefresh);
    };
  }, [fetchAccounts]);

  const refetch = useCallback(() => fetchAccounts(false), [fetchAccounts]);

  return { accounts, isLoading, error, refetch };
}
