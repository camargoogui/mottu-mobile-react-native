import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.text.primary,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
}); 