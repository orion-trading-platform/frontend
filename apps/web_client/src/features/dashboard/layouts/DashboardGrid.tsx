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
      
      <div className={styles.statsArea}>
        {stats}
      </div>
      
      {/* The main content area (Chart + Holdings Table) */}
      <div className={styles.mainArea}>
        <div className={styles.chartSection}>
          {chart}
        </div>
        <div className={styles.holdingsSection}>
          {holdings}
        </div>
      </div>

      {/* The Sidebar (Recent Activity) */}
      <div className={styles.sidebarArea}>
        {activity}
      </div>
    </div>
  );
};