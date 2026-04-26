import { useEffect, useState } from 'react';
import { fetchHeaderBigMovers, MoverItem } from '../api/dashboardApi'; 
import styles from './BiggestMovers.module.css';

// 1. We only need onSelect here now, since data comes strictly from the API
interface BiggestMoversProps {
  onSelect?: (symbol: string) => void;
}

// 2. Destructure onSelect from the props
export const BiggestMovers = ({ onSelect }: BiggestMoversProps) => {
  const [movers, setMovers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMovers = async () => {
      try {
        // The API handles its own fallbacks, so we just trust the data it returns
        const data = await fetchHeaderBigMovers();
        setMovers(data);
      } catch (error) {
        console.error('Failed to fetch big movers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovers();
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <span>Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {movers.map((m) => {
          const isPositive = m.changePercent >= 0;
          return (
            <button
              key={m.symbol}
              type="button"
              className={styles.item}
              // 3. onSelect works beautifully here now
              onClick={() => onSelect?.(m.symbol)}
              title={`Open ${m.symbol} on trade page`}
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