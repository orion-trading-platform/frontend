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

  useEffect(() => {
    api
      .get<AccountInfo[]>("/auth/me/accounts")
      .then((res) => setAccounts(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return { accounts, isLoading };
}
