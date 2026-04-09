import { ReactNode } from 'react';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  header: ReactNode;
  movers: ReactNode;
  stats?: ReactNode;
  chart?: ReactNode;
  activity?: ReactNode;
  holdings: ReactNode;
}

export const DashboardGrid = ({ header, movers, stats, chart, activity, holdings }: DashboardGridProps) => {
  return (
    <div className={styles.container}>
      <header className={styles.headerArea}>
        {header}
      </header>
      <main style={{ display: 'contents' }}>
        <div className={styles.moversArea}>
          {movers}
        </div>
        {(stats || chart) && (
          <div className={styles.mainArea}>
            <div className={styles.accountSummaryBox}>
              <h2 className={styles.accountSummaryTitle}>Account Summary</h2>
              <div className={styles.statsArea}>
                {stats}
              </div>
              <div className={styles.chartSection}>
                {chart}
              </div>
            </div>
          </div>
        )}
        {activity && (
          <div className={styles.sidebarArea}>
            {activity}
          </div>
        )}
        <div className={styles.holdingsSection}>
          {holdings}
        </div>
      </main>
    </div>
  );
};