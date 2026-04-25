import styles from './HoldingsTable.module.css';

export interface Holding {
  ticker: string;
  companyName: string;
  currentPrice: number;
  costBasis: number;
  changeDaily: number;
  quantity: number;
  peRatio: number;
  totalReturn: number;
  tradingVolume: number;
};

export interface HoldingsTableProps {
  holdings: Holding[];
  onSelect?: (ticker: string) => void;
}


export const HoldingsTable = ({ holdings, onSelect }: HoldingsTableProps) => {
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
            <tr key={h.ticker} className={styles.row} onClick={() => onSelect?.(h.ticker)}>
              <td className={styles.tdSymbol}>{h.ticker}</td>
              <td className={styles.td}>${h.currentPrice}</td>
              <td className={styles.td}>${h.costBasis}</td>
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
