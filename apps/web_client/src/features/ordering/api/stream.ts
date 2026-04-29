export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: string;
  bidPrice?: number;
  bidSize?: number;
  askPrice?: number;
  askSize?: number;
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
  quote?: { bp?: number; bs?: number; ap?: number; as?: number };
  latestQuote?: { bp?: number; bs?: number; ap?: number; as?: number };
  latest_quote?: {
    bid_price?: number;
    bid_size?: number;
    ask_price?: number;
    ask_size?: number;
    bp?: number;
    bs?: number;
    ap?: number;
    as?: number;
  };
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

type QuoteTop = {
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
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

function pickTopQuote(s: AlpacaSnapshot | undefined): QuoteTop | null {
  if (!s) return null;

  const bidPrice =
    s.latest_quote?.bid_price ?? s.latest_quote?.bp ?? s.latestQuote?.bp ?? s.quote?.bp;
  const askPrice =
    s.latest_quote?.ask_price ?? s.latest_quote?.ap ?? s.latestQuote?.ap ?? s.quote?.ap;
  const bidSize =
    s.latest_quote?.bid_size ?? s.latest_quote?.bs ?? s.latestQuote?.bs ?? s.quote?.bs ?? 0;
  const askSize =
    s.latest_quote?.ask_size ?? s.latest_quote?.as ?? s.latestQuote?.as ?? s.quote?.as ?? 0;

  if (typeof bidPrice !== "number" || typeof askPrice !== "number") return null;

  return {
    bidPrice,
    askPrice,
    bidSize: typeof bidSize === "number" ? bidSize : 0,
    askSize: typeof askSize === "number" ? askSize : 0,
  };
}

const MARKET_DATA_URL =
  import.meta.env.VITE_MARKET_DATA_URL ?? "http://localhost:8001";

export function subscribeToStream(
  symbols: string[],
  onUpdate: (update: PriceUpdate) => void
): () => void {
  const normalized = symbols.map((s) => s.toUpperCase());
  const streamUrl = `${MARKET_DATA_URL}/api/stream?symbols=${encodeURIComponent(normalized.join(","))}`;
  const source = new EventSource(streamUrl);

  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as AlpacaStreamEvent;
      const tsIso = coerceTimestampToIso(payload.timestamp);
      const snapshots = payload.snapshots ?? {};

      for (const sym of normalized) {
        const snapshot = snapshots[sym];
        const quote = pickTopQuote(snapshot);
        const parsedPrice = pickPrice(snapshot);
        const derivedPrice =
          parsedPrice ??
          (quote ? (quote.bidPrice + quote.askPrice) / 2 : null);

        if (derivedPrice == null) continue;

        onUpdate({
          symbol: sym,
          price: derivedPrice,
          timestamp: tsIso,
          bidPrice: quote?.bidPrice,
          bidSize: quote?.bidSize,
          askPrice: quote?.askPrice,
          askSize: quote?.askSize,
        });
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
