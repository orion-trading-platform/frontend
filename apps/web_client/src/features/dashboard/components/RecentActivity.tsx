import { useEffect, useState } from 'react';
import { useAccount } from '@/features/auth';
import { fetchRecentActivity, ActivityItem } from '../api/dashboardApi';
import styles from './RecentActivity.module.css';

import BuyIcon from './icons/BuyIcon.png';
import SellIcon from './icons/SellIcon.png';
import DepositIcon from './icons/DepositIcon.png';
import DividendIcon from './icons/DividendIcon.png';
import TradeIcon from './icons/TradeIcon.png';
import PulseIcon from './icons/PulseIcon.png';
import CashIcon from './icons/CashIcon.png';

// ==========================================
// 1. THE INDIVIDUAL ROW / CARD
// ==========================================
const ActivityCard = ({ item }: { item: ActivityItem }) => {
  const type = item.type?.toUpperCase();

  let uiType = 'Unknown';

  if (type === 'TRADE') {
    uiType = item.quantity && item.quantity > 0 ? 'Buy' : 'Sell';
  } else if (type === 'DEPOSIT') {
    uiType = 'Deposit';
  } else if (type === 'WITHDRAWAL') {
    uiType = 'Withdrawal';
  } else if (type === 'REJECTED') {
    uiType = 'Rejected';
  }

 const iconMap: Record<string, string> = {
    Buy: BuyIcon,
    Sell: SellIcon,
    Deposit: DepositIcon,
    Withdrawal: CashIcon,
    Rejected: PulseIcon,
    Trade: TradeIcon,
    Dividend: DividendIcon,
    Unknown: CashIcon,
  };

  const iconSrc = iconMap[uiType] ?? CashIcon;

  const tickerStr = item.symbol ? ` ${item.symbol}` : '';
  const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const amountAbs = item.amount ? Math.abs(item.amount).toFixed(2) : '0.00';
  const isPositiveImpact = uiType === 'Sell' || uiType === 'Deposit';

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <img
          src={iconSrc}
          alt={`${uiType} Icon`}
          style={{ width: '36px', height: '36px', borderRadius: '12px' }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <span className={styles.label}>
            {uiType}{tickerStr}
          </span>

          <span className={`${styles.value} ${isPositiveImpact ? styles.valuePos : styles.valueNeg}`}>
            {isPositiveImpact ? '+ ' : '- '}${amountAbs}
          </span>
        </div>

        <div className={styles.caption}>
          <div className={styles.time}>
            {dateStr}
          </div>

          <div className={styles.status}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. THE PARENT FEED (Exports to your Dashboard)
// ==========================================
export interface RecentActivityFeedProps {
  onClick?: () => void;
}

export const RecentActivityFeed = ({ onClick }: RecentActivityFeedProps) => {
  const { account, isLoading: accountLoading } = useAccount();

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadActivity = async () => {
      if (!account?.account_id) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchRecentActivity(String(account.account_id));
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [account?.account_id]);

  if (accountLoading) {
    return <div style={{ padding: '20px', color: '#636a7ab7' }}>Loading account...</div>;
  }

  if (!account?.account_id) {
    return <div style={{ padding: '20px', color: '#636a7ab7' }}>No account selected.</div>;
  }

  if (loading) {
    return <div style={{ padding: '20px', color: '#636a7ab7' }}>Loading recent activity...</div>;
  }

  if (activities.length === 0) {
    return <div style={{ padding: '20px', color: '#636a7ab7' }}>No recent activity.</div>;
  }

  return (
    <div
      className={styles.feedContainer}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {activities.map((item) => (
        <ActivityCard key={item.id} item={item} />
      ))}
    </div>
  );
};