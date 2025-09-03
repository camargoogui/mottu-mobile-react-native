import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text.primary,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.text.secondary}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    fontSize: 16,
    fontWeight: '400',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
}); 