import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import weekCsv from '../data/ds1_7_days_hourly.csv?raw';
import yearCsv from '../data/ds2_1_year_daily.csv?raw';
import fiveYearsCsv from '../data/ds3_5_years_monthly.csv?raw';

type Timeline = 'week' | 'year' | '5years';

interface ChartPoint {
  time: string;
  value: number;
}

function parseWeekCsv(csv: string): ChartPoint[] {
  const parsed = Papa.parse<{ Ticker: string; Day: string; Hour: string; Price: string }>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const byDayHour = new Map<string, number>();
  for (const row of parsed.data) {
    const key = `${row.Day} ${row.Hour}`;
    const price = parseFloat(row.Price);
    byDayHour.set(key, (byDayHour.get(key) ?? 0) + price);
  }
  return Array.from(byDayHour.entries())
    .map(([time, value]) => ({ time, value }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

function parseYearCsv(csv: string): ChartPoint[] {
  const parsed = Papa.parse<{ Ticker: string; Day: string; Price: string }>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const byDay = new Map<string, number>();
  for (const row of parsed.data) {
    const key = row.Day;
    const price = parseFloat(row.Price);
    byDay.set(key, (byDay.get(key) ?? 0) + price);
  }
  return Array.from(byDay.entries())
    .map(([time, value]) => ({ time, value }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

function parseFiveYearsCsv(csv: string): ChartPoint[] {
  const parsed = Papa.parse<{ Ticker: string; Month: string; Price: string }>(csv, {
    header: true,
    skipEmptyLines: true,
  });
  const byMonth = new Map<string, number>();
  for (const row of parsed.data) {
    const key = row.Month;
    const price = parseFloat(row.Price);
    byMonth.set(key, (byMonth.get(key) ?? 0) + price);
  }
  return Array.from(byMonth.entries())
    .map(([time, value]) => ({ time, value }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

const TIMELINE_LABELS: Record<Timeline, string> = {
  week: 'Week',
  year: 'Year',
  '5years': '5 Years',
};

export const PerformanceChart = () => {
  const [timeline, setTimeline] = useState<Timeline>('week');

  const dataByTimeline = useMemo(() => ({
    week: parseWeekCsv(weekCsv),
    year: parseYearCsv(yearCsv),
    '5years': parseFiveYearsCsv(fiveYearsCsv),
  }), []);

  const data = dataByTimeline[timeline];

  return (
    <div style={{ width: '95%', height: 350, padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0, color: '#e3e5e4' }}>Performance History</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeline(key)}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: timeline === key ? '#2563eb' : '#fff',
                color: timeline === key ? '#fff' : '#6b7280',
                cursor: 'pointer',
              }}
            >
              {TIMELINE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total value']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
