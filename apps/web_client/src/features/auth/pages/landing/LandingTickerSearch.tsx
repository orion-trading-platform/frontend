import { useState, useMemo, useRef, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { DUMMY_TICKERS } from '@/features/dashboard/data/tickerSearchData';
// import { searchStocks } from '@/features/ordering/api/stocks';
import styles from './LandingTickerSearch.module.css';

interface LandingTickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: (symbol: string) => void;
}

export const LandingTickerSearch = ({
  value,
  onChange,
  placeholder = 'Search for a stock...',
  onSelect,
}: LandingTickerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  //TODO: Replace dummy data with below commented code (Issue #43, credit @enagashe)
  const filteredOptions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return DUMMY_TICKERS;
    return DUMMY_TICKERS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [value]);

  // const [apiResults, setApiResults] = useState<{ symbol: string; name: string }[]>([]);
  // const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // const query = value.trim();
  // const filteredOptions = query ? apiResults : DUMMY_TICKERS;

  // useEffect(() => {
  //   if (!query) {
  //     setApiResults([]);
  //     return;
  //   }
  //   clearTimeout(debounceRef.current);
  //   debounceRef.current = setTimeout(() => {
  //     searchStocks(query).then(setApiResults).catch(() => setApiResults([]));
  //   }, 250);
  //   return () => clearTimeout(debounceRef.current);
  // }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => setIsOpen(true);
  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setIsOpen(false);
    onSelect?.(symbol);
  };

  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <MdSearch size={20} className={styles.icon} aria-hidden />
      <input
        role="combobox"
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        aria-label="Search for a stock"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
      />
      {showDropdown && (
        <ul className={styles.dropdown} role="listbox">
          {filteredOptions.map((ticker) => (
            <li
              key={ticker.symbol}
              role="option"
              className={styles.option}
              onClick={() => handleSelect(ticker.symbol)}
            >
              <span className={styles.optionSymbol}>{ticker.symbol}</span>
              <span className={styles.optionName}>{ticker.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
