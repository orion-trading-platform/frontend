export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: string;
}

/**
 * SSE subscription for Market Data API snapshot stream.
 *
 * Uses a **same-origin** path only (`/api/stream?...`) so `EventSource` never cross-origin calls the
 * Market Data API directly — no CORS changes required on that service. Your dev server must proxy
 * `/api` to the Market Data API (see `vite.config.ts` `server.proxy`).
 */

type AlpacaStreamEvent = {
  timestamp?: number | string;
  snapshots?: Record<string, AlpacaSnapshot>;
  [k: string]: unknown;
};

type AlpacaSnapshot = {
  price?: number;
  latestTrade?: { p?: number };
  latest_trade?: { price?: number; p?: number };
  minuteBar?: { c?: number };
  minute_bar?: { close?: number; c?: number };
  dailyBar?: { c?: number };
  daily_bar?: { close?: number; c?: number };
  prevDailyBar?: { c?: number };
  previous_daily_bar?: { close?: number; c?: number };
  [k: string]: unknown;
};

function coerceTimestampToIso(ts: unknown): string {
  if (typeof ts === "number") {
    const ms = ts > 1e12 ? ts : ts * 1000;
    return new Date(ms).toISOString();
  }
  if (typeof ts === "string") {
    const d = new Date(ts);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function pickPrice(s: AlpacaSnapshot | undefined): number | null {
  if (!s) return null;
  if (typeof s.price === "number") return s.price;
  const snakeTrade = s.latest_trade?.price ?? s.latest_trade?.p;
  if (typeof snakeTrade === "number") return snakeTrade;
  const trade = s.latestTrade?.p;
  if (typeof trade === "number") return trade;
  const snakeMinuteClose = s.minute_bar?.close ?? s.minute_bar?.c;
  if (typeof snakeMinuteClose === "number") return snakeMinuteClose;
  const minClose = s.minuteBar?.c;
  if (typeof minClose === "number") return minClose;
  const snakeDayClose = s.daily_bar?.close ?? s.daily_bar?.c;
  if (typeof snakeDayClose === "number") return snakeDayClose;
  const dayClose = s.dailyBar?.c;
  if (typeof dayClose === "number") return dayClose;
  const prevDayClose = s.previous_daily_bar?.close ?? s.previous_daily_bar?.c;
  if (typeof prevDayClose === "number") return prevDayClose;
  return null;
}

export function subscribeToStream(
  symbols: string[],
  onUpdate: (update: PriceUpdate) => void
): () => void {
  const normalized = symbols.map((s) => s.toUpperCase());
  const streamUrl = `/api/stream?symbols=${encodeURIComponent(normalized.join(","))}`;
  const source = new EventSource(streamUrl);

  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as AlpacaStreamEvent;
      const tsIso = coerceTimestampToIso(payload.timestamp);
      const snapshots = payload.snapshots ?? {};

      for (const sym of normalized) {
        const price = pickPrice(snapshots[sym]);
        if (price == null) continue;
        onUpdate({ symbol: sym, price, timestamp: tsIso });
      }
    } catch {
      // Ignore malformed stream payloads; keep connection alive.
    }
  };

  source.onerror = () => {
    // Keep default EventSource retry behavior; callers can unsubscribe.
  };

  return () => {
    source.close();
  };
}
