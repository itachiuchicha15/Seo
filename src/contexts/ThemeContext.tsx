import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { THEMES, ThemeType } from '../lib/themes';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('corporate-prime');

  const setTheme = (newTheme: ThemeType) => {
    console.log('ThemeContext: Setting theme to', newTheme);
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const palette = THEMES[theme];

    // Apply the theme attribute for targetted styling
    root.setAttribute('data-theme', theme);

    // Dynamically set CSS variables from our centralized JS source of truth
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-primary-foreground', palette.primaryForeground);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-secondary-foreground', palette.secondaryForeground);
    root.style.setProperty('--color-dark', palette.dark);
    root.style.setProperty('--color-light', palette.light);
    root.style.setProperty('--color-muted', palette.muted);
    root.style.setProperty('--color-chart', palette.chart);

    // Update the browser theme color if applicable
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', palette.dark);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
export type { ThemeType };