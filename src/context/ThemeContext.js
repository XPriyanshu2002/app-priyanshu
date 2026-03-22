import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getTheme } from '../theme/tokens';

const STORAGE_KEY = 'bestinfra_theme_mode';

const ThemeContext = createContext({
  mode: 'light',
  theme: getTheme('light'),
  toggleTheme: () => {},
  isReady: false,
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode === 'dark' || savedMode === 'light') {
          setMode(savedMode);
        }
      } finally {
        setIsReady(true);
      }
    };

    load();
  }, []);

  const toggleTheme = async () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  };

  const value = useMemo(
    () => ({
      mode,
      theme: getTheme(mode),
      toggleTheme,
      isReady,
    }),
    [mode, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext);
