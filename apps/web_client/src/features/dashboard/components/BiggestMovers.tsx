import { useEffect, useState } from 'react';
import { fetchHeaderBigMovers, MoverItem } from '../api/dashboardApi'; // Adjust path if your api.ts is elsewhere
import styles from './BiggestMovers.module.css';

export const BiggestMovers = () => {
  const [movers, setMovers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMovers = async () => {
      try {
        // This will hit the API the first time, and use our 60s cache after that!
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

  // Optional: A minimal loading state so the layout doesn't jump
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
            <div key={m.symbol} className={styles.item}>
              <span className={styles.symbol}>{m.symbol}</span>
              <span className={styles.price}>${m.price.toFixed(2)}</span>
              <span className={`${styles.change} ${isPositive ? styles.up : styles.down}`}>
                {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{m.changePercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};