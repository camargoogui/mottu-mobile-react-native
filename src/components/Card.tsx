import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card = ({ 
  children, 
  style, 
  variant = 'elevated',
  padding = 'medium'
}: CardProps) => {
  const { theme } = useTheme();
  
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    };

    // Padding styles following Apple HIG
    switch (padding) {
      case 'none':
        baseStyle.padding = 0;
        break;
      case 'small':
        baseStyle.padding = theme.spacing.sm;
        break;
      case 'large':
        baseStyle.padding = theme.spacing.lg;
        break;
      default: // medium
        baseStyle.padding = theme.spacing.md;
        break;
    }

    // Variant styles following Apple HIG
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = theme.colors.background;
        // iOS shadow system
        baseStyle.shadowColor = theme.colors.label;
        baseStyle.shadowOffset = {
          width: 0,
          height: 1,
        };
        baseStyle.shadowOpacity = theme.mode === 'light' ? 0.1 : 0.3;
        baseStyle.shadowRadius = 3;
        baseStyle.elevation = 2; // Android equivalent
        break;
      case 'filled':
        baseStyle.backgroundColor = theme.colors.secondaryBackground;
        break;
      case 'outlined':
        baseStyle.backgroundColor = theme.colors.background;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.separator;
        break;
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles are now handled dynamically
}); 