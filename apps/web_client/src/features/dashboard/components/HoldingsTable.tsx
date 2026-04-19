import { Holding } from '../api/dashboardApi'; 
import styles from './HoldingsTable.module.css';

// 1. Change props to accept the array of holdings
export interface HoldingsTableProps {
  holdings: Holding[];
}

// 2. Remove the internal useEffect and internal filtering
export const HoldingsTable = ({ holdings }: HoldingsTableProps) => {

  if (!holdings || holdings.length === 0) {
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
            <th className={styles.th}>Ticker</th>
            <th className={styles.th}>Current Price</th>
            <th className={styles.th}>Cost Basis</th>
            <th className={styles.th}>Change Daily</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Total Return</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.ticker} className={styles.row}>
              <td className={styles.tdSymbol}>{h.ticker}</td>
              <td className={styles.td}>${h.currentPrice.toFixed(2)}</td>
              <td className={styles.td}>${h.costBasis.toFixed(2)}</td>
              <td className={`${styles.td} ${h.changeDaily >= 0 ? styles.positive : styles.negative}`}>
                {h.changeDaily >= 0 ? '+' : ''}{h.changeDaily}%
              </td>
              <td className={styles.td}>{h.quantity}</td>
              <td className={`${styles.td} ${h.totalReturn >= 0 ? styles.positive : styles.negative}`}>
                {h.totalReturn >= 0 ? '+' : ''}${Math.abs(h.totalReturn).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};