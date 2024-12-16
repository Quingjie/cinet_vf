'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'auto',
  theme: 'light',
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initialise le mode sauvegardé
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }

    // Fonction pour déterminer le thème
    const determineTheme = () => {
      if (mode === 'auto') {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? 'dark' : 'light';
      }
      return mode;
    };

    // Applique le thème initial
    const initialTheme = determineTheme();
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Écouteur pour les changements de préférences système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'auto') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);

    // Si manuel, détermine le thème immédiatement
    if (newMode !== 'auto') {
      setTheme(newMode);
      document.documentElement.classList.toggle('dark', newMode === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);