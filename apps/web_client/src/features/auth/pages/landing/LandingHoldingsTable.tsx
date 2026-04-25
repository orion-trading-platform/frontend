import { Holding } from './api/landingDashboardApi';
import styles from './LandingHoldingsTable.module.css';

export interface LandingHoldingsTableProps {
  holdings: Holding[];
  publicOnly?: boolean;
  onSelect?: (ticker: string) => void;
}

export const LandingHoldingsTable = ({ holdings, onSelect }: LandingHoldingsTableProps) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className={styles.empty}>
        No tickers match your search.
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
            <th className={styles.th}>Change Daily %</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr
              key={h.ticker}
              className={styles.row}
              tabIndex={onSelect ? 0 : undefined}
              onClick={() => onSelect?.(h.ticker)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(h.ticker); } }}
            >
              <td className={styles.tdSymbol}>{h.ticker}</td>
              <td className={styles.td}>${h.currentPrice.toFixed(2)}</td>
              <td className={`${styles.td} ${h.changeDaily >= 0 ? styles.positive : styles.negative}`}>
                {h.changeDaily >= 0 ? '+' : ''}{h.changeDaily.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
