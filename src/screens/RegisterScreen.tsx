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
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { MaterialIcons } from '@expo/vector-icons';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { register, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Nome é obrigatório';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(email, password, displayName);
      Alert.alert(
        'Conta Criada com Sucesso!', 
        'Sua conta foi criada com sucesso. Agora você pode fazer login.',
        [
          { 
            text: 'Fazer Login', 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
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
          Criar Conta
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Cadastre-se para acessar o sistema
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          Cadastro
        </Text>

        <Input
          label="Nome Completo"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Digite seu nome completo"
          autoCapitalize="words"
          error={errors.displayName}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha (mín. 6 caracteres)"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Digite a senha novamente"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button
          title={loading ? "Criando conta..." : "Criar Conta"}
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
