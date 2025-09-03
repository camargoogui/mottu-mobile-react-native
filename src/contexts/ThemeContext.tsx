import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    header: {
      fontSize: number;
      fontWeight: string;
    };
    subheader: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
  layout: {
    container: {
      flex: number;
      backgroundColor: string;
    };
    card: {
      padding: number;
      borderRadius: number;
      backgroundColor: string;
    };
  };
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#4CAF50',
    background: '#FFFFFF',
    card: '#f5f5f5',
    text: {
      primary: '#000000',
      secondary: '#666666',
      light: '#FFFFFF',
    },
    border: '#ddd',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    card: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: '#f5f5f5',
    },
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#66BB6A',
    background: '#121212',
    card: '#1e1e1e',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      light: '#FFFFFF',
    },
    border: '#333333',
    success: '#66BB6A',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    card: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: '#1e1e1e',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    saveTheme(newMode);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
