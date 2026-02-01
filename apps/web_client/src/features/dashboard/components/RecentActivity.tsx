import styles from './RecentActivity.module.css';

interface RecentActivityProps {
    label: string;
    time: string;
    value: string;
    status: string;
    isPositive: boolean;
}

export const RecentActivity = ({label, time, value, status, isPositive}: RecentActivityProps) => {
    return (
        <div className = {styles.card}>

            <div className = {styles.icon}>
            
            </div>
            <div className = {styles.content}>
                <div className = {styles.header}>
                    <span className = {styles.label}>
                        
                    </span>
                    <span className = {`${styles.value} ${isPositive ? styles.valuePos : styles.valueNeg}`}>
                        {value}
                    </span>
                </div>
                <div className = {styles.time}>
                
                </div>
                <div className = {styles.status}>
                    {status}
                </div>
            </div>

        </div>

    )
}
