// Maps to GET /api/stream
// Returns real-time price updates via Server-Sent Events

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: string;
}

export function subscribeToStream(
  symbols: string[],
  onUpdate: (update: PriceUpdate) => void
): () => void {
  // For the stub, we simulate periodic price updates

  let currentPrice = 175.43;

  const interval = setInterval(() => {
    const variance = parseFloat((Math.random() * 0.2 - 0.1).toFixed(2));
    currentPrice = parseFloat((currentPrice + variance).toFixed(2));

    onUpdate({
      symbol: symbols[0],
      price: currentPrice,
      timestamp: new Date().toISOString(),
    });
  }, 5000); // every 5 seconds to mimic real SSE cadence

  // Return a cleanup function — caller uses this to stop the subscription
  return () => clearInterval(interval);
}
