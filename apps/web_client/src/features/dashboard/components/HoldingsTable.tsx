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
            <th className={styles.th}>Ticker</th>
            <th className={styles.th}>Company Name</th>
            <th className={styles.th}>Current Price</th>
            <th className={styles.th}>Cost Basis</th>
            <th className={styles.th}>Change Daily</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>P/E Ratio</th>
            <th className={styles.th}>Total Return</th>
            <th className={styles.th}>Trading Volume</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.ticker} className={styles.row}>
              <td className={styles.tdSymbol}>{h.ticker}</td>
              <td className={styles.td}>{h.companyName}</td>
              <td className={styles.td}>${h.currentPrice}</td>
              <td className={styles.td}>${h.costBasis}</td>
              <td className={`${styles.td} ${h.changeDaily >= 0 ? styles.positive : styles.negative}`}>
                {h.changeDaily}%
              </td>
              <td className={styles.td}>{h.quantity}</td>
              <td className={styles.td}>{h.peRatio}</td>
              <td className={`${styles.td} ${h.totalReturn >= 0 ? styles.positive : styles.negative}`}>
                ${h.totalReturn}</td>
              <td className={styles.td}>{h.tradingVolume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
