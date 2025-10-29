import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
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
        // iOS shadow system - melhorado apenas para modo escuro
        baseStyle.shadowColor = theme.colors.label;
        baseStyle.shadowOffset = {
          width: 0,
          height: theme.mode === 'dark' ? 2 : 1,
        };
        baseStyle.shadowOpacity = theme.mode === 'light' ? 0.1 : 0.4;
        baseStyle.shadowRadius = theme.mode === 'dark' ? 4 : 3;
        baseStyle.elevation = theme.mode === 'dark' ? 4 : 2; // Android equivalent
        // Adicionar borda sutil apenas no modo escuro para melhor visibilidade
        if (theme.mode === 'dark') {
          baseStyle.borderWidth = 0.5;
          baseStyle.borderColor = theme.colors.separator;
        }
        break;
      case 'filled':
        baseStyle.backgroundColor = theme.colors.secondaryBackground;
        // Adicionar borda sutil apenas no modo escuro
        if (theme.mode === 'dark') {
          baseStyle.borderWidth = 0.5;
          baseStyle.borderColor = theme.colors.separator;
        }
        break;
      case 'outlined':
        baseStyle.backgroundColor = theme.colors.background;
        baseStyle.borderWidth = theme.mode === 'dark' ? 1.5 : 1;
        baseStyle.borderColor = theme.colors.separator;
        break;
    }

    return baseStyle;
  };

  return (
    <Animated.View
      style={[
        getCardStyle(),
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Styles are now handled dynamically
}); 