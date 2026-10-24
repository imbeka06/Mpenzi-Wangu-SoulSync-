import React, { createContext, useContext, useState } from 'react';

export type ThemeKey = 'pink' | 'dark' | 'gold' | 'blue' | 'green' | 'lavender';

export interface ThemeColors {
  background: string;
  cardBg: string;
  primary: string;
  headerText: string;
  subText: string;
  border: string;
  inputText: string;
}

export const THEMES: Record<ThemeKey, ThemeColors> = {
  pink: {
    background: '#FFF5F7',
    cardBg: '#FFFFFF',
    primary: '#FF6B8B',
    headerText: '#D81B60',
    subText: '#718096',
    border: '#FFD1DC',
    inputText: '#2D3748',
  },
  dark: {
    background: '#121212',
    cardBg: '#1E1E1E',
    primary: '#FF6B8B',
    headerText: '#FF8DA1',
    subText: '#A0AEC0',
    border: '#333333',
    inputText: '#FFFFFF',
  },
  gold: {
    background: '#1A1813',
    cardBg: '#2A261F',
    primary: '#D4AF37',
    headerText: '#F3E5AB',
    subText: '#C5A059',
    border: '#4A3E2C',
    inputText: '#F3E5AB',
  },
  blue: {
    background: '#F0F8FF',
    cardBg: '#FFFFFF',
    primary: '#3182CE',
    headerText: '#2B6CB0',
    subText: '#4A5568',
    border: '#BEE3F8',
    inputText: '#2D3748',
  },
  green: {
    background: '#F0FDF4',
    cardBg: '#FFFFFF',
    primary: '#10B981',
    headerText: '#047857',
    subText: '#4B5563',
    border: '#A7F3D0',
    inputText: '#1F2937',
  },
  lavender: {
    background: '#FAF5FF',
    cardBg: '#FFFFFF',
    primary: '#8B5CF6',
    headerText: '#6D28D9',
    subText: '#6B7280',
    border: '#DDD6FE',
    inputText: '#1F2937',
  },
};

const ThemeContext = createContext({
  themeKey: 'pink' as ThemeKey,
  colors: THEMES.pink,
  setThemeKey: (key: ThemeKey) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>('pink');

  return (
    <ThemeContext.Provider
      value={{
        themeKey,
        colors: THEMES[themeKey],
        setThemeKey,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);