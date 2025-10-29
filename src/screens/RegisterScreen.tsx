import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { MaterialIcons } from '@expo/vector-icons';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { register, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = t('auth.nameRequired');
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = t('auth.nameMin');
    }

    if (!email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!password.trim()) {
      newErrors.password = t('auth.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordMin');
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(email, password, displayName);
      Alert.alert(
        t('auth.accountCreatedTitle'), 
        t('auth.accountCreatedMessage'),
        [
          { 
            text: t('auth.doLogin'), 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <MaterialIcons 
          name="person-add" 
          size={80} 
          color={theme.colors.primary} 
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {t('auth.createAccount')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {t('auth.registerSubtitle')}
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          {t('auth.register')}
        </Text>

        <Input
          label={t('auth.fullName')}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={t('auth.fullNamePlaceholder')}
          autoCapitalize="words"
          error={errors.displayName}
        />

        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <Input
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.passwordPlaceholder')}
          secureTextEntry
          error={errors.password}
        />

        <Input
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button
          title={loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          onPress={handleRegister}
          variant="primary"
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.text.secondary }]}>
            ou
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={[styles.loginText, { color: theme.colors.primary }]}>
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
          Ao criar uma conta, você concorda com nossos termos de uso
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
