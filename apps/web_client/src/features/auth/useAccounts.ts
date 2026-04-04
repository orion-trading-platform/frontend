import { useState, useEffect } from "react";
import api from "./api";

export interface AccountInfo {
  account_id: number;
  balance: string;
  currency: string;
  version: number;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    api
      .get<AccountInfo[]>("/auth/me/accounts")
      .then((res) => { if (!ignore) setAccounts(res.data); })
      .catch(() => { if (!ignore) setError(true); })
      .finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, []);

  return { accounts, isLoading, error };
}
