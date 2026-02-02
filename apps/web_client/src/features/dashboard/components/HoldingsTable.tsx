import type { Holding } from '../data/mockData';
import styles from './HoldingsTable.module.css';

interface HoldingsTableProps {
  holdings: Holding[];
}

export const HoldingsTable = ({ holdings }: HoldingsTableProps) => {
  if (holdings.length === 0) {
    return (
      <div className={styles.empty}>
        No holdings match your search.
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Symbol</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Change</th>
            <th className={styles.th}>Shares</th>
            <th className={styles.th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.symbol} className={styles.row}>
              <td className={styles.tdSymbol}>{h.symbol}</td>
              <td className={styles.td}>{h.name}</td>
              <td className={styles.td}>${h.price.toFixed(2)}</td>
              <td className={`${styles.td} ${h.change.startsWith('+') ? styles.positive : styles.negative}`}>
                {h.change}
              </td>
              <td className={styles.td}>{h.shares}</td>
              <td className={styles.td}>${h.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
