import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Apple HIG Color System
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  
  // System Colors
  systemBlue: string;
  systemGreen: string;
  systemIndigo: string;
  systemOrange: string;
  systemPink: string;
  systemPurple: string;
  systemRed: string;
  systemTeal: string;
  systemYellow: string;
  
  // Background Colors
  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  
  // Fill Colors
  fill: string;
  secondaryFill: string;
  tertiaryFill: string;
  quaternaryFill: string;
  
  // Label Colors
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  quaternaryLabel: string;
  
  // Separator Colors
  separator: string;
  opaqueSeparator: string;
  
  // Other Colors
  link: string;
  placeholderText: string;
  
  // Semantic Colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Legacy support
  card: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  border: string;
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
    xxl: number;
    xxxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    // Apple HIG Typography
    largeTitle: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    title1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    title2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    title3: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    headline: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    callout: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    subhead: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    footnote: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    caption1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    caption2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
    };
    // Legacy support
    header: {
      fontSize: number;
      fontWeight: string;
    };
    subheader: {
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
    // Apple HIG Color System
    primary: '#007AFF',           // iOS Blue
    secondary: '#5856D6',         // iOS Purple
    tertiary: '#FF9500',          // iOS Orange
    quaternary: '#FF2D92',        // iOS Pink
    
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    
    // Background Colors
    background: '#FFFFFF',        // iOS White
    secondaryBackground: '#F2F2F7', // iOS Grouped Background
    tertiaryBackground: '#FFFFFF', // iOS Secondary Grouped Background
    
    // Fill Colors
    fill: '#78788033',           // iOS Fill (30% opacity)
    secondaryFill: '#78788028',  // iOS Secondary Fill (20% opacity)
    tertiaryFill: '#7676801F',   // iOS Tertiary Fill (12% opacity)
    quaternaryFill: '#74748014', // iOS Quaternary Fill (8% opacity)
    
    // Label Colors
    label: '#000000',            // iOS Label
    secondaryLabel: '#3C3C4399', // iOS Secondary Label (60% opacity)
    tertiaryLabel: '#3C3C434D',  // iOS Tertiary Label (30% opacity)
    quaternaryLabel: '#3C3C4329', // iOS Quaternary Label (18% opacity)
    
    // Separator Colors
    separator: '#3C3C434A',      // iOS Separator (29% opacity)
    opaqueSeparator: '#C6C6C8',  // iOS Opaque Separator
    
    // Other Colors
    link: '#007AFF',             // iOS Link
    placeholderText: '#3C3C434D', // iOS Placeholder Text (30% opacity)
    
    // Semantic Colors
    success: '#34C759',          // iOS Green
    error: '#FF3B30',            // iOS Red
    warning: '#FF9500',          // iOS Orange
    info: '#007AFF',             // iOS Blue
    
    // Legacy support
    card: '#F2F2F7',
    text: {
      primary: '#000000',
      secondary: '#3C3C4399',
      light: '#FFFFFF',
    },
    border: '#C6C6C8',
  },
  // Apple HIG Spacing System (8pt grid)
  spacing: {
    xs: 4,    // 0.5 * 8pt
    sm: 8,    // 1 * 8pt
    md: 16,   // 2 * 8pt
    lg: 24,   // 3 * 8pt
    xl: 32,   // 4 * 8pt
    xxl: 40,  // 5 * 8pt
    xxxl: 48, // 6 * 8pt
  },
  // Apple HIG Border Radius
  borderRadius: {
    sm: 8,    // iOS Small radius
    md: 12,   // iOS Medium radius
    lg: 16,   // iOS Large radius
    xl: 20,   // iOS Extra large radius
  },
  // Apple HIG Typography (SF Pro Display/Text)
  typography: {
    // Large Titles
    largeTitle: {
      fontSize: 34,
      fontWeight: '400',
      lineHeight: 41,
      letterSpacing: 0.37,
    },
    // Titles
    title1: {
      fontSize: 28,
      fontWeight: '400',
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    title2: {
      fontSize: 22,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    title3: {
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 25,
      letterSpacing: 0.38,
    },
    // Headlines
    headline: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    // Body
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    callout: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
      letterSpacing: -0.32,
    },
    subhead: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    caption1: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 13,
      letterSpacing: 0.07,
    },
    // Legacy support
    header: {
      fontSize: 28,
      fontWeight: '400',
    },
    subheader: {
      fontSize: 22,
      fontWeight: '400',
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
    },
  },
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    card: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#F2F2F7',
    },
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    // Apple HIG Dark Mode Color System
    primary: '#0A84FF',           // iOS Blue (Dark)
    secondary: '#5E5CE6',         // iOS Purple (Dark)
    tertiary: '#FF9F0A',          // iOS Orange (Dark)
    quaternary: '#FF375F',        // iOS Pink (Dark)
    
    // System Colors (Dark)
    systemBlue: '#0A84FF',
    systemGreen: '#30D158',
    systemIndigo: '#5E5CE6',
    systemOrange: '#FF9F0A',
    systemPink: '#FF375F',
    systemPurple: '#BF5AF2',
    systemRed: '#FF453A',
    systemTeal: '#64D2FF',
    systemYellow: '#FFD60A',
    
    // Background Colors (Dark)
    background: '#000000',        // iOS Black
    secondaryBackground: '#1C1C1E', // iOS Grouped Background (Dark)
    tertiaryBackground: '#2C2C2E', // iOS Secondary Grouped Background (Dark)
    
    // Fill Colors (Dark)
    fill: '#78788050',           // iOS Fill (Dark) (31% opacity)
    secondaryFill: '#7878803D',  // iOS Secondary Fill (Dark) (24% opacity)
    tertiaryFill: '#7676802E',   // iOS Tertiary Fill (Dark) (18% opacity)
    quaternaryFill: '#7474801A', // iOS Quaternary Fill (Dark) (10% opacity)
    
    // Label Colors (Dark)
    label: '#FFFFFF',            // iOS Label (Dark)
    secondaryLabel: '#EBEBF599', // iOS Secondary Label (Dark) (60% opacity)
    tertiaryLabel: '#EBEBF54D',  // iOS Tertiary Label (Dark) (30% opacity)
    quaternaryLabel: '#EBEBF52E', // iOS Quaternary Label (Dark) (18% opacity)
    
    // Separator Colors (Dark)
    separator: '#38383A',        // iOS Separator (Dark)
    opaqueSeparator: '#38383A',  // iOS Opaque Separator (Dark)
    
    // Other Colors (Dark)
    link: '#0A84FF',             // iOS Link (Dark)
    placeholderText: '#EBEBF54D', // iOS Placeholder Text (Dark) (30% opacity)
    
    // Semantic Colors (Dark)
    success: '#30D158',          // iOS Green (Dark)
    error: '#FF453A',            // iOS Red (Dark)
    warning: '#FF9F0A',          // iOS Orange (Dark)
    info: '#0A84FF',             // iOS Blue (Dark)
    
    // Legacy support
    card: '#1C1C1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF599',
      light: '#FFFFFF',
    },
    border: '#38383A',
  },
  // Apple HIG Spacing System (8pt grid) - same as light
  spacing: {
    xs: 4,    // 0.5 * 8pt
    sm: 8,    // 1 * 8pt
    md: 16,   // 2 * 8pt
    lg: 24,   // 3 * 8pt
    xl: 32,   // 4 * 8pt
    xxl: 40,  // 5 * 8pt
    xxxl: 48, // 6 * 8pt
  },
  // Apple HIG Border Radius - same as light
  borderRadius: {
    sm: 8,    // iOS Small radius
    md: 12,   // iOS Medium radius
    lg: 16,   // iOS Large radius
    xl: 20,   // iOS Extra large radius
  },
  // Apple HIG Typography - same as light
  typography: {
    // Large Titles
    largeTitle: {
      fontSize: 34,
      fontWeight: '400',
      lineHeight: 41,
      letterSpacing: 0.37,
    },
    // Titles
    title1: {
      fontSize: 28,
      fontWeight: '400',
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    title2: {
      fontSize: 22,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    title3: {
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 25,
      letterSpacing: 0.38,
    },
    // Headlines
    headline: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    // Body
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    callout: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
      letterSpacing: -0.32,
    },
    subhead: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    caption1: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 13,
      letterSpacing: 0.07,
    },
    // Legacy support
    header: {
      fontSize: 28,
      fontWeight: '400',
    },
    subheader: {
      fontSize: 22,
      fontWeight: '400',
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
    },
  },
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    card: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#1C1C1E',
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