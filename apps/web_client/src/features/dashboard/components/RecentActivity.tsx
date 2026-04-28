import { useEffect, useState } from 'react';
import { useAccount } from '@/features/auth';
import { fetchRecentActivity, ActivityItem } from '../api/dashboardApi'; // Adjust path
import styles from './RecentActivity.module.css';

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

  const iconName = uiType === 'Rejected' ? 'Pulse' : uiType;

  const tickerStr = item.symbol ? ` ${item.symbol}` : '';
  const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric', year: 'numeric' 
  }); 
  const amountAbs = item.amount ? Math.abs(item.amount).toFixed(2) : '0.00';

  const isPositiveImpact = uiType === 'Sell' || uiType === 'Deposit';
  
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <img 
          src={`/src/features/dashboard/components/icons/${iconName}Icon.png`} 
          alt={`${uiType} Icon`} 
          style={{ width: '36px', height: '36px', borderRadius: '12px' }}
          onError={(e) => {
            e.currentTarget.src = '/src/features/dashboard/components/icons/DefaultIcon.png';
          }}
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

// 1. Define the props interface to include onClick
export interface RecentActivityFeedProps {
  onClick?: () => void;
}

// 2. Destructure onClick in the component parameters
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
    // 3. Attach onClick here, and optionally add a pointer cursor so users know it's clickable
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