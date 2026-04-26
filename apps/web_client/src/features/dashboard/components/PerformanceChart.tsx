import { useState, useEffect } from 'react';
import { useAccount } from '@/features/auth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchGraphData, GraphDataPoint } from '../api/dashboardApi'; // Adjust path to your api.ts
import styles from './PerformanceChart.module.css';

type Timeline = 'week' | 'year' | '5years';

const TIMELINE_LABELS: Record<Timeline, string> = {
  week: 'Week',
  year: 'Year',
  '5years': '5 Years',
};

// Map your timeline strings to the integer days your API expects
const TIMELINE_DAYS: Record<Timeline, number> = {
  week: 7,
  year: 365,
  '5years': 1825,
};

export const PerformanceChart = () => {
  const { account, isLoading: accountLoading } = useAccount();

  const [timeline, setTimeline] = useState<Timeline>('week');
  const [data, setData] = useState<GraphDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch new graph data whenever the user clicks a different timeline tab
  useEffect(() => {
    const loadChartData = async () => {
      if (!account?.account_id) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const days = TIMELINE_DAYS[timeline];
        const chartData = await fetchGraphData(String(account.account_id), days);
        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [timeline, account?.account_id]);

  if (accountLoading) {
    return (
      <div style={{ width: '95%', height: 350, padding: '10px', color: '#bcc8e1b7' }}>
        Loading account...
      </div>
    );
  }

  if (!account?.account_id) {
    return (
      <div style={{ width: '95%', height: 350, padding: '10px', color: '#bcc8e1b7' }}>
        No account selected.
      </div>
    );
  }

  return (
    <div style={{ width: '95%', height: 350, padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0, color: '#e3e5e4' }}>Performance History</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((key) => (
            <button
              key={key}
              id={key}
              type="button"
              className={`${styles.switch} ${timeline === key ? styles.switchactive : ''}`}
              onClick={() => setTimeline(key)}
            >
              {TIMELINE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        {loading ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#bcc8e1b7' }}>
            Loading chart data...
          </div>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb70" />
            <XAxis
              dataKey="date" // Mapped to the 'date' property from GraphDataPoint
              tick={{ fontSize: 12, fill: '#bcc8e1b7' }}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#bcc8e1b7' }}
              tickLine={false}
              axisLine={false}
              // Formats the Y axis ticks to have a $ sign and commas (e.g. $125,000)
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total value']}
              labelFormatter={(label) => `Date: ${label}`} // Adds context to the tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="value" // Mapped to the 'value' property from GraphDataPoint
              stroke="#5179b2"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};