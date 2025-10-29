import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = true, 
  disabled = false,
  style 
}: ButtonProps) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles following Apple HIG
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = theme.spacing.md;
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.minHeight = 32;
        break;
      case 'large':
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.paddingVertical = theme.spacing.lg;
        baseStyle.minHeight = 50;
        break;
      default: // medium
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.minHeight = 44; // Apple HIG minimum touch target
        break;
    }

    // Variant styles following Apple HIG
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = theme.colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.fill;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.separator;
        break;
      case 'tertiary':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'destructive':
        baseStyle.backgroundColor = theme.colors.error;
        break;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    } else {
      // Remove width when not fullWidth to allow flex to work properly
      baseStyle.width = undefined;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = theme.typography.footnote.fontSize;
        baseStyle.lineHeight = theme.typography.footnote.lineHeight;
        break;
      case 'large':
        baseStyle.fontSize = theme.typography.headline.fontSize;
        baseStyle.lineHeight = theme.typography.headline.lineHeight;
        break;
      default: // medium
        baseStyle.fontSize = theme.typography.callout.fontSize;
        baseStyle.lineHeight = theme.typography.callout.lineHeight;
        break;
    }

    // Color styles following Apple HIG
    switch (variant) {
      case 'primary':
        baseStyle.color = theme.colors.label;
        break;
      case 'secondary':
        baseStyle.color = theme.colors.label;
        break;
      case 'tertiary':
        baseStyle.color = theme.colors.primary;
        break;
      case 'destructive':
        baseStyle.color = theme.colors.label;
        break;
    }

    return baseStyle;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={getTextStyle()}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Styles are now handled dynamically
}); 