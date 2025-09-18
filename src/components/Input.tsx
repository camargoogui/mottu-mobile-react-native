import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
}

export const Input = ({ 
  label, 
  error, 
  helperText,
  variant = 'outlined',
  size = 'medium',
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  style, 
  ...props 
}: InputProps) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  
  const getContainerStyle = (): any => {
    const baseStyle = {
      marginBottom: theme.spacing.md,
    };

    return baseStyle;
  };

  const getLabelStyle = (): any => {
    const baseStyle = {
      ...theme.typography.callout,
      color: theme.colors.label,
      marginBottom: theme.spacing.xs,
    };

    if (error) {
      baseStyle.color = theme.colors.error;
    }

    return baseStyle;
  };

  const getInputContainerStyle = (): any => {
    const baseStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
      minHeight: size === 'small' ? 36 : size === 'large' ? 52 : 44, // Apple HIG heights
    };

    // Variant styles following Apple HIG
    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = theme.colors.fill;
        baseStyle.borderWidth = 0;
        if (isFocused) {
          baseStyle.backgroundColor = theme.colors.secondaryFill;
        }
        break;
      case 'outlined':
        baseStyle.backgroundColor = theme.colors.background;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error ? theme.colors.error : 
                               isFocused ? theme.colors.primary : 
                               theme.colors.separator;
        break;
    }

    return baseStyle;
  };

  const getInputStyle = (): any => {
    const baseStyle = {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.label,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    };

    // Size adjustments
    switch (size) {
      case 'small':
        baseStyle.fontSize = theme.typography.footnote.fontSize;
        baseStyle.lineHeight = theme.typography.footnote.lineHeight;
        baseStyle.paddingVertical = theme.spacing.xs;
        break;
      case 'large':
        baseStyle.fontSize = theme.typography.title3.fontSize;
        baseStyle.lineHeight = theme.typography.title3.lineHeight;
        baseStyle.paddingVertical = theme.spacing.md;
        break;
    }

    return baseStyle;
  };

  const getHelperTextStyle = (): any => {
    return {
      ...theme.typography.caption1,
      color: error ? theme.colors.error : theme.colors.secondaryLabel,
      marginTop: theme.spacing.xs,
    };
  };

  const toggleSecureText = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <MaterialIcons 
            name={leftIcon as any} 
            size={20} 
            color={theme.colors.secondaryLabel}
            style={{ marginLeft: theme.spacing.sm }}
          />
        )}
        
        <TextInput
          style={[getInputStyle(), style]}
          placeholderTextColor={theme.colors.placeholderText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={toggleSecureText}
            style={{ marginRight: theme.spacing.sm }}
          >
            <MaterialIcons 
              name={isSecure ? 'visibility-off' : 'visibility'} 
              size={20} 
              color={theme.colors.secondaryLabel}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={{ marginRight: theme.spacing.sm }}
          >
            <MaterialIcons 
              name={rightIcon as any} 
              size={20} 
              color={theme.colors.secondaryLabel}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles are now handled dynamically
}); 