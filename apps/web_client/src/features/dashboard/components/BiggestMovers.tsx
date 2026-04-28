import { useEffect, useState } from 'react';
import { fetchHeaderBigMovers, MoverItem } from '../api/dashboardApi'; 
import { subscribeToStream } from '@/features/ordering/api/stream'; // adjust path if needed
import styles from './BiggestMovers.module.css';

interface BiggestMoversProps {
  onSelect?: (symbol: string) => void;
}

export const BiggestMovers = ({ onSelect }: BiggestMoversProps) => {
  const [movers, setMovers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMovers = async () => {
      try {
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

  useEffect(() => {
    if (movers.length === 0) return;

    const symbols = movers.map((m) => m.symbol);

    const unsubscribe = subscribeToStream(symbols, (update) => {
      setMovers((prev) =>
        prev.map((m) =>
          m.symbol === update.symbol
            ? { ...m, price: update.price }
            : m
        )
      );
    });

    return unsubscribe;
  }, [movers.map((m) => m.symbol).join(',')]);

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