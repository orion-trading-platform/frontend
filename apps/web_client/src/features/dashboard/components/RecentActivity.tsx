import styles from './RecentActivity.module.css';

export interface RecentActivityProps {
    id: number;
    ticker: string;
    date: string;
    quantity: string;
    type: string;
    price: string;
    totalPrice: string;
    status: string;
}

interface RecentActivityCardProps extends RecentActivityProps {
    onClick?: () => void;
}

export const RecentActivity = ({ticker, date, quantity, type, price, totalPrice, status, onClick}: RecentActivityCardProps) => {
    const isNeg = type == "Buy";
    return (
        <button type="button" className = {styles.card} onClick={onClick}>

            <div className = {styles.icon}>
                <img src = {`/src/features/dashboard/components/icons/${type}Icon.png`} alt = "Icon" style={{width : '36px', height : '36px',  borderRadius : '12px'}}/>
              
            </div>
            <div className = {styles.content}>
                <div className = {styles.headerRow}>
                    <span className = {styles.label}>
                        {type} {ticker}
                    </span>
                    <span className = {`${styles.value} ${isNeg ? styles.valuePos : styles.valueNeg}`}>
                        {isNeg ? "+ " : "- "}${totalPrice}
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

        </button>

    )
}
