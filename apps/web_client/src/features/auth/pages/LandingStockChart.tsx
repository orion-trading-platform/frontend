import { useEffect, useMemo, useState } from "react";
import { Bar, ComposedChart, ErrorBar, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from '@/ThemeContext';
import { getStockBars } from "@/features/ordering/api/stocks";

// Maps UI button labels to API timeframe param and how many days back to fetch
const TIMEFRAME_CONFIG: Record<string, { apiTimeframe: string; daysBack: number }> = {
  "1D": { apiTimeframe: "1Hour", daysBack: 1 },
  "1W": { apiTimeframe: "1Hour", daysBack: 7 },
  "1M": { apiTimeframe: "1Day", daysBack: 30 },
  "3M": { apiTimeframe: "1Day", daysBack: 90 },
  "1Y": { apiTimeframe: "1Week", daysBack: 365 },
  "ALL": { apiTimeframe: "1Month", daysBack: 365 * 5 }, //placeholder for now until we integrate with API
};

type ChartFormat = "line" | "candlestick";

// from stub API, may need to change with API integration
interface OHLCBar {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartBar extends OHLCBar {
  barIndex: number;
  price: number;
  bodyBottom: number;
  bodyHeight: number;
  wickLower: number;
  wickUpper: number;
  upBody: number;
  downBody: number;
}

interface StockChartProps {
  symbol: string;
}

const TOOLTIP_STYLE = {
  backgroundColor: "#1f2937",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
};

function formatStockAxisTick(ts: number, timeframe: string): string {
  const d = new Date(ts);
  switch (timeframe) {
    case "1D":
      return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    case "1W":
      return d.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
    case "1M":
    case "3M":
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    case "1Y":
    case "ALL":
      return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
    default:
      return d.toLocaleString();
  }
}

function formatStockTooltipTime(ts: number, timeframe: string): string {
  const d = new Date(ts);
  if (timeframe === "1D" || timeframe === "1W") {
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function CandlestickTooltipContent({
  active,
  payload,
  timeframe,
}: {
  active?: boolean;
  payload?: readonly { payload?: ChartBar }[];
  timeframe: string;
}) {
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload as ChartBar | undefined;

  if (!p) return null;
  const ohlcColor = p.close >= p.open ? "#10b981" : "#ef4444";
  const timeLabel = formatStockTooltipTime(p.timestamp, timeframe);
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: "8px 12px" }}>
      {timeLabel !== "" && <div style={{ marginBottom: "4px", color: "#fff" }}>{timeLabel}</div>}
      <div style={{ color: ohlcColor, display: "flex", flexDirection: "column", gap: "2px" }}>
        <div>Open: ${p.open.toFixed(2)}</div>
        <div>High: ${p.high.toFixed(2)}</div>
        <div>Low: ${p.low.toFixed(2)}</div>
        <div>Close: ${p.close.toFixed(2)}</div>
      </div>
    </div>
  );
}

export function LandingStockChart({ symbol }: StockChartProps) {
  const { dark } = useTheme();
  const [timeframe, setTimeframe] = useState("1D");
  const [chartFormat, setChartFormat] = useState<ChartFormat>("line");
  const [bars, setBars] = useState<OHLCBar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { apiTimeframe, daysBack } = TIMEFRAME_CONFIG[timeframe];
    const start = new Date();
    start.setDate(start.getDate() - daysBack);

    setIsLoading(true);
    getStockBars(symbol, apiTimeframe, start.toISOString()).then((rawBars) => {
      setBars(rawBars);
      setIsLoading(false);
    });
  }, [symbol, timeframe]);

  const chartData = useMemo((): ChartBar[] => {
    return bars.map((bar, barIndex) => {
      const bodyBottom = Math.min(bar.open, bar.close);
      const bodyTop = Math.max(bar.open, bar.close);
      const bodyHeight = bodyTop - bodyBottom || 0.01;
      const isUp = bar.close >= bar.open;
      return {
        ...bar,
        barIndex,
        price: bar.close,
        bodyBottom,
        bodyHeight,
        wickLower: bodyTop - bar.low,
        wickUpper: bar.high - bodyTop,
        upBody: isUp ? bodyHeight : 0,
        downBody: isUp ? 0 : bodyHeight,
      };
    });
  }, [bars]);

  const lineData = useMemo(
    () => chartData.map((d) => ({ timestamp: d.timestamp, price: d.price })),
    [chartData]
  );

  const candlestickYDomain = useMemo((): [number, number] | undefined => {
    if (chartData.length === 0) return undefined;
    const lows = chartData.map((d) => d.low);
    const highs = chartData.map((d) => d.high);
    return [Math.min(...lows) - 1, Math.max(...highs) + 1];
  }, [chartData]);

  const yDomain = chartFormat === "line" ? ["dataMin - 1", "dataMax + 1"] : candlestickYDomain;

  const axisTickFill = dark ? "#94a3b8" : "#6b7280";
  const axisLineStroke = dark ? "rgba(148,163,184,0.15)" : "#e5e7eb";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-[rgba(148,163,184,0.10)] bg-white dark:bg-[#0f1520] p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold dark:text-slate-100">Price Chart</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-[rgba(148,163,184,0.10)] bg-gray-50 dark:bg-[#0b111b] p-0.5">
            {(["line", "candlestick"] as const).map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => setChartFormat(format)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  chartFormat === format
                    ? "bg-white dark:bg-[#0f1520] text-gray-900 dark:text-slate-100 shadow-sm"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
              >
                {format === "line" ? "Line" : "Candlestick"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  timeframe === tf ? "bg-blue-600 text-white" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-[rgba(148,163,184,0.08)]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center text-gray-400 dark:text-slate-500">Loading...</div>
      ) : bars.length === 0 ? (
        <div
          role="status"
          className="flex h-[300px] items-center justify-center px-4 text-center text-gray-500 dark:text-slate-400"
        >
          No data available for the selected timeframe.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartFormat === "line" ? lineData : chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            barCategoryGap={0}
          >
            <XAxis
              dataKey={chartFormat === "candlestick" ? "barIndex" : "timestamp"}
              type={chartFormat === "candlestick" ? "category" : "number"}
              {...(chartFormat === "line"
                ? { scale: "time" as const, domain: ["dataMin", "dataMax"] as const }
                : {})}
              tickFormatter={(v) => {
                if (chartFormat === "candlestick") {
                  const row = chartData[Number(v)];
                  return row ? formatStockAxisTick(row.timestamp, timeframe) : "";
                }
                return formatStockAxisTick(Number(v), timeframe);
              }}
              tick={{ fontSize: 12, fill: axisTickFill }}
              tickLine={false}
              axisLine={{ stroke: axisLineStroke }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              type="number"
              domain={yDomain}
              allowDataOverflow={chartFormat === "candlestick"}
              tick={{ fontSize: 12, fill: axisTickFill }}
              tickLine={false}
              axisLine={{ stroke: axisLineStroke }}
              tickFormatter={(value) => `$${value}`}
            />
            {chartFormat === "line" ? (
              <>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(label) =>
                    typeof label === "number" && !Number.isNaN(label)
                      ? formatStockTooltipTime(label, timeframe)
                      : ""
                  }
                  formatter={(value: unknown) => {
                    const n = typeof value === "number" && !Number.isNaN(value) ? value : undefined;
                    return n !== undefined ? [`$${n.toFixed(2)}`, "Price"] : ["—", "Price"];
                  }}
                />
                <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
              </>
            ) : (
              <>
                <Tooltip
                  content={(props) => <CandlestickTooltipContent {...props} timeframe={timeframe} />}
                />
                <Bar dataKey="bodyBottom" stackId="candle" fill="transparent" barSize={14} />
                <Bar
                  dataKey="upBody"
                  stackId="candle"
                  fill="#10b981"
                  stroke="#10b981"
                  strokeWidth={1}
                  barSize={14}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="downBody"
                  stackId="candle"
                  fill="#ef4444"
                  stroke="#ef4444"
                  strokeWidth={1}
                  barSize={14}
                  isAnimationActive={false}
                >
                  <ErrorBar
                    dataKey={(entry: ChartBar) => [entry.wickLower, entry.wickUpper]}
                    stroke="#6b7280"
                    strokeWidth={1}
                    direction="y"
                  />
                </Bar>
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
