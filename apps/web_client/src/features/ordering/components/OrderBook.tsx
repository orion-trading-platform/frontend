const generateOrderBookData = () => {
  const bids: { price: string; size: number; total: number }[] = [];
  const asks: { price: string; size: number; total: number }[] = [];
  const basePrice = 175.43;

  for (let i = 0; i < 8; i += 1) {
    bids.push({
      price: (basePrice - 0.05 * (i + 1)).toFixed(2),
      size: Math.floor(Math.random() * 500 + 100),
      total: Math.floor(Math.random() * 5000 + 1000),
    });

    asks.push({
      price: (basePrice + 0.05 * (i + 1)).toFixed(2),
      size: Math.floor(Math.random() * 500 + 100),
      total: Math.floor(Math.random() * 5000 + 1000),
    });
  }

  return { bids, asks };
};

export function OrderBook() {
  const { bids, asks } = generateOrderBookData();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold">Order Book</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-gray-500">
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
          </div>
          <div className="space-y-1">
            {bids.map((bid, index) => (
              <div
                key={`bid-${index.toString()}`}
                className="relative flex items-center justify-between overflow-hidden rounded px-2 py-1 text-sm hover:bg-green-50"
              >
                <div
                  className="absolute bottom-0 right-0 top-0 bg-green-100"
                  style={{ width: `${(bid.total / 5000) * 100}%` }}
                />
                <span className="relative z-10 font-semibold text-green-500">${bid.price}</span>
                <span className="relative z-10">{bid.size}</span>
                <span className="relative z-10 text-gray-600">{bid.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-gray-500">
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
          </div>
          <div className="space-y-1">
            {asks.map((ask, index) => (
              <div
                key={`ask-${index.toString()}`}
                className="relative flex items-center justify-between overflow-hidden rounded px-2 py-1 text-sm hover:bg-red-50"
              >
                <div
                  className="absolute bottom-0 right-0 top-0 bg-red-100"
                  style={{ width: `${(ask.total / 5000) * 100}%` }}
                />
                <span className="relative z-10 font-semibold text-red-500">${ask.price}</span>
                <span className="relative z-10">{ask.size}</span>
                <span className="relative z-10 text-gray-600">{ask.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
