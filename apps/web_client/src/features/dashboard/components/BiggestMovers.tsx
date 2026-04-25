import { MoverItem, MOCK_BIGGEST_MOVERS } from '../data/biggestMoversData';
import styles from './BiggestMovers.module.css';

interface BiggestMoversProps {
  movers?: MoverItem[];
  onSelect?: (symbol: string) => void;
}

export const BiggestMovers = ({ movers = MOCK_BIGGEST_MOVERS, onSelect }: BiggestMoversProps) => {
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
