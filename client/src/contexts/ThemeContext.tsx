import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    border: string;
    borderHover: string;
    borderActive: string;
    headerBg: string;
    panelBg: string;
    statusBarBg: string;
  };
}

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#000000',
    backgroundSecondary: '#0a0a0a',
    backgroundTertiary: '#1a1a1a',
    text: '#00ff00',
    textSecondary: '#00ffff',
    textTertiary: '#666666',
    primary: '#00ff00',
    secondary: '#00ffff',
    accent: '#ffff00',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffff00',
    info: '#00ffff',
    border: '#333333',
    borderHover: '#666666',
    borderActive: '#00ff00',
    headerBg: '#0a0a0a',
    panelBg: '#000000',
    statusBarBg: '#0a0a0a',
  },
};

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundTertiary: '#e0e0e0',
    text: '#000000',
    textSecondary: '#333333',
    textTertiary: '#666666',
    primary: '#0066cc',
    secondary: '#0099cc',
    accent: '#ff6600',
    success: '#00cc00',
    error: '#cc0000',
    warning: '#ff9900',
    info: '#0099cc',
    border: '#cccccc',
    borderHover: '#999999',
    borderActive: '#0066cc',
    headerBg: '#f5f5f5',
    panelBg: '#ffffff',
    statusBarBg: '#f5f5f5',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('terminal-theme');
    return (saved as ThemeMode) || 'dark';
  });

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('terminal-theme', themeMode);
    // Update body class for global styles
    document.body.className = `theme-${themeMode}`;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export { darkTheme, lightTheme };
