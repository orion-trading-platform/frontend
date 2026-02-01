import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export const StatCard = ({ label, value, change, isPositive }: StatCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox}>
        {/* We'll add real icons later, using a placeholder for now */}
        {isPositive ? '📈' : '📉'}
      </div>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <span className={styles.label}>{label}</span>
          <span className={`${styles.badge} ${isPositive ? styles.green : styles.red}`}>
            {change}
          </span>
        </div>
        <div className={styles.value}>{value}</div>
      </div>
    </div>
  );
};