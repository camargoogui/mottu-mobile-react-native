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

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login, loading } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Botões de Idioma */}
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { 
              backgroundColor: currentLanguage === 'pt-BR' ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }
          ]}
          onPress={() => changeLanguage('pt-BR')}
        >
          <MaterialIcons 
            name="language" 
            size={18} 
            color={currentLanguage === 'pt-BR' ? '#FFFFFF' : theme.colors.text.primary} 
          />
          <Text style={[
            styles.languageButtonText,
            { color: currentLanguage === 'pt-BR' ? '#FFFFFF' : theme.colors.text.primary }
          ]}>
            {t('settings.portuguese')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { 
              backgroundColor: currentLanguage === 'en' ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }
          ]}
          onPress={() => changeLanguage('en')}
        >
          <MaterialIcons 
            name="language" 
            size={18} 
            color={currentLanguage === 'en' ? '#FFFFFF' : theme.colors.text.primary} 
          />
          <Text style={[
            styles.languageButtonText,
            { color: currentLanguage === 'en' ? '#FFFFFF' : theme.colors.text.primary }
          ]}>
            {t('settings.english')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <MaterialIcons 
          name="motorcycle" 
          size={80} 
          color={theme.colors.primary} 
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.colors.label }]}>
          {t('auth.appTitle')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondaryLabel }]}>
          {t('auth.appSubtitle')}
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Text style={[styles.formTitle, { color: theme.colors.label }]}>
          {t('auth.login')}
        </Text>

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
          placeholder={t('auth.password')}
          secureTextEntry
          error={errors.password}
        />

        <Button
          title={loading ? t('common.loading') : t('auth.loginButton')}
          onPress={handleLogin}
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

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={[styles.registerText, { color: theme.colors.primary }]}>
            {t('auth.noAccount')}
          </Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
          Desenvolvido para o desafio Mottu
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
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 41,
    letterSpacing: 0.37,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 34,
    letterSpacing: 0.36,
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
  registerButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  registerText: {
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
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    justifyContent: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
