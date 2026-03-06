import { ReactNode } from 'react';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  header: ReactNode;
  stats: ReactNode;
  chart: ReactNode;
  activity: ReactNode;
  holdings: ReactNode;
}

export const DashboardGrid = ({ header, stats, chart, activity, holdings }: DashboardGridProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        {header}
      </div>
      {/*Main content area:  stats, chart*/}
      <div className={styles.mainArea}>
        <div className={styles.statsArea}>
          {stats}
        </div>
        <div className={styles.chartSection}>
          {chart}
        </div>
      </div>
      {/*sidebar */}
      <div className={styles.sidebarArea}>
        {activity}
      </div>
      {/*holdings */}
      <div className={styles.holdingsSection}>
        {holdings}
      </div>
    </div>
  );
};