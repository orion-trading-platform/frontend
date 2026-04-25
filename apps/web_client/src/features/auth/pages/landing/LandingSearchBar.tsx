import { MdSearch } from 'react-icons/md';
import styles from './LandingSearchBar.module.css';

interface LandingSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LandingSearchBar = ({ value, onChange, placeholder = 'Search...' }: LandingSearchBarProps) => {
  return (
    <div className={styles.wrapper}>
      <MdSearch size={20} className={styles.icon} aria-hidden />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search S&P 500 symbols or companies"
      />
    </div>
  );
};
