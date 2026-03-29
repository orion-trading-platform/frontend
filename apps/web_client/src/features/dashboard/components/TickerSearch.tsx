import { useState, useMemo, useRef, useEffect } from 'react';
import { DUMMY_TICKERS } from '../data/tickerSearchData';
import styles from './TickerSearch.module.css';

interface TickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: (symbol: string) => void;
}

export const TickerSearch = ({
  value,
  onChange,
  placeholder = 'Search for a stock...',
  onSelect,
}: TickerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return DUMMY_TICKERS;
    return DUMMY_TICKERS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [value]);

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
      <span className={styles.icon} aria-hidden>🔍</span>
      <input
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
