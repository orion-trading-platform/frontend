import { MdSearch } from 'react-icons/md';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search holdings by symbol or name...' }: SearchBarProps) => {
  return (
    <div className={styles.wrapper}>
      <MdSearch size={20} className={styles.icon} aria-hidden />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search holdings"
      />
    </div>
  );
};
