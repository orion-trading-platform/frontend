import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export const StatCard = ({ label, value, change, isPositive, icon }: StatCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox}>
        {/* We'll add real icons later, using a placeholder for now */}
        <img src={`/icons/${icon}Icon.png`} alt="Icon" style={{width : '48px', height : '48px',  borderRadius : '8px'}}/>
        
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