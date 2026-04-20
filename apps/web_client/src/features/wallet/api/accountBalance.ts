import { isAxiosError } from "axios";
import api from "@/features/auth/api";

export interface BalanceReadResponse {
  account_id: string;
  balance: string | number;
  currency: string;
  version: number;
}

/** Delta applied to balance: positive adds funds, negative withdraws (FastAPI `BalanceUpdate`). */
export async function patchAccountBalance(
  accountId: string,
  amountDelta: number,
  version: number
): Promise<BalanceReadResponse> {
  const res = await api.patch<BalanceReadResponse>(
    `/accounts/${encodeURIComponent(accountId)}/balance`,
    { amount: amountDelta, version }
  );
  return res.data;
}

export function formatAccountBalanceError(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { detail?: unknown } | undefined;
    const d = data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d[0] && typeof (d[0] as { msg?: string }).msg === "string") {
      return (d[0] as { msg: string }).msg;
    }
  }
  if (err instanceof Error) return err.message;
  return "Request failed. Please try again.";
}
