import styles from './RecentActivity.module.css';

interface RecentActivityProps {
    type: string;
    symbol: string;
    date: string;
    value: string;
    status: string;
    isPositive: boolean;
}

export const RecentActivity = ({type, symbol, date, value, status, isPositive}: RecentActivityProps) => {
    return (
        <div className = {styles.card}>

            <div className = {styles.icon}>
            
            </div>
            <div className = {styles.content}>
                <div className = {styles.headerRow}>
                    <span className = {styles.label}>
                        {type} {symbol}
                        
                    </span>
                    <span className = {`${styles.value} ${isPositive ? styles.valuePos : styles.valueNeg}`}>
                        {value}
                    </span>
                </div>
                <div className = {styles.caption}>
                    <div className = {styles.time}>
                        {date}
                    </div>
                    <div className = {styles.status}>
                        {status}
                    </div>
                </div>
            </div>

        </div>

    )
}
