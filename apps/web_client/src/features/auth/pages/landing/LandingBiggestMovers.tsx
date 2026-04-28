import { useEffect, useState } from 'react';
import { fetchHeaderBigMovers, MoverItem } from './api/landingDashboardApi';
import styles from './LandingBiggestMovers.module.css';

interface LandingBiggestMoversProps {
  onSelect?: (symbol: string) => void;
}

export const LandingBiggestMovers = ({ onSelect }: LandingBiggestMoversProps) => {
  const [movers, setMovers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeaderBigMovers()
      .then(data => { setMovers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper} tabIndex={-1}>
        <div className={styles.list} tabIndex={-1}>
          <span>Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} tabIndex={-1}>
      <div className={styles.list} tabIndex={-1}>
        {movers.map((m) => {
          const isPositive = m.changePercent >= 0;
          return (
            <button
              key={m.symbol}
              type="button"
              className={styles.item}
              onClick={() => onSelect?.(m.symbol)}
              title={`View ${m.symbol}`}
            >
              <span className={styles.symbol}>{m.symbol}</span>
              <span className={styles.price}>${m.price.toFixed(2)}</span>
              <span className={`${styles.change} ${isPositive ? styles.up : styles.down}`}>
                {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{m.changePercent}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
