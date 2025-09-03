import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button = ({ onPress, title, variant = 'primary', fullWidth = true }: ButtonProps) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant === 'primary' ? theme.colors.primary : 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: variant === 'secondary' ? 1 : 0,
        },
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          {
            color: variant === 'primary' ? theme.colors.text.light : theme.colors.primary,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 