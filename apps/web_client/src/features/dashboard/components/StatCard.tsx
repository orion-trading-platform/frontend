import styles from './StatCard.module.css';

import cashIcon from './icons/CashIcon.png';
import walletIcon from './icons/WalletIcon.png';
import graphIcon from './icons/GraphIcon.png';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const iconMap: Record<string, string> = {
  Portfolio: walletIcon,
  Cash: cashIcon,
  Yield: graphIcon,
};

export const StatCard = ({ label, value, change, isPositive, icon }: StatCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox}>
        <img
          src={iconMap[icon] || graphIcon}
          alt={`${label} Icon`}
          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain' }}
        />
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