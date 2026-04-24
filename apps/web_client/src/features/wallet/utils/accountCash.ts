/** Max single deposit (USD) — frontend guard; backend has no matching cap as of implementation. */
export const MAX_SINGLE_DEPOSIT_USD = 10_000_000;

export function accountBalanceToNumber(balance: string | undefined | null): number {
  if (balance == null || balance === "") return 0;
  const n = Number(balance);
  return Number.isFinite(n) ? n : 0;
}

export function formatUsdCash(amount: number, currencyCode = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/** Parse user deposit text to dollar amount with 2 decimal places; uses integer cents to reduce float noise. */
export function parseDepositDollarsToCents(raw: string): { ok: true; cents: number } | { ok: false; reason: string } {
  const t = raw.trim();
  if (t === "") return { ok: false, reason: "Enter an amount." };
  const normalized = t.replace(/,/g, "");
  if (!/^\d*(\.\d{0,2})?$/.test(normalized)) {
    return { ok: false, reason: "Use a valid money amount (up to 2 decimal places)." };
  }
  const n = Number(normalized);
  if (!Number.isFinite(n)) return { ok: false, reason: "Enter a valid amount." };
  if (n <= 0) return { ok: false, reason: "Amount must be greater than zero." };
  if (n > Number.MAX_SAFE_INTEGER / 100) {
    return { ok: false, reason: "Amount is too large to process safely." };
  }
  const cents = Math.round(n * 100);
  if (cents <= 0) return { ok: false, reason: "Amount must be greater than zero." };
  return { ok: true, cents };
}

export function centsToDecimalString(cents: number): string {
  return (cents / 100).toFixed(2);
}
