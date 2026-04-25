import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'orion-theme';

interface ThemeContextValue {
  dark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggleDark: () => {} });

/**
 * Wraps the app with dark-mode context
 * User preference persists in localStorage under the key 'orion-theme'
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const toggleDark = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Provides { dark, toggleDark } for any component
 * that needs to read or change the current theme
 *
 * @property dark       - true when dark mode is active
 * @property toggleDark - flips dark ↔ light theme and
 *                        persists the new value
 *
 * @example
 *  const { dark, toggleDark } = useTheme();
 */
export const useTheme = () => useContext(ThemeContext);
