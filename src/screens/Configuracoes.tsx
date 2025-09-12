import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';

const filiais = [
  'São Paulo - Centro',
  'São Paulo - Zona Sul',
  'São Paulo - Zona Norte',
  'São Paulo - Zona Leste',
  'São Paulo - Zona Oeste',
];

export const Configuracoes = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [filialSelecionada, setFilialSelecionada] = useState<string>('');

  useEffect(() => {
    carregarFilial();
  }, []);

  const carregarFilial = async () => {
    try {
      const filial = await AsyncStorage.getItem('filial');
      if (filial) {
        setFilialSelecionada(filial);
      }
    } catch (error) {
      console.error('Erro ao carregar filial:', error);
    }
  };

  const salvarFilial = async (filial: string) => {
    try {
      await AsyncStorage.setItem('filial', filial);
      setFilialSelecionada(filial);
      Alert.alert('Sucesso', 'Filial atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      Alert.alert('Erro', 'Não foi possível salvar a filial');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível fazer logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.titulo, { color: theme.colors.text.primary }]}>Configurações</Text>
      
      {/* Informações do usuário */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>Usuário</Text>
        <Text style={[styles.userInfo, { color: theme.colors.text.secondary }]}>
          {user?.displayName || 'Usuário'}
        </Text>
        <Text style={[styles.userInfo, { color: theme.colors.text.secondary }]}>
          {user?.email}
        </Text>
      </View>
      
      {/* Seção de Tema */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>Aparência</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <MaterialIcons 
              name={theme.mode === 'dark' ? 'dark-mode' : 'light-mode'} 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>
              Modo {theme.mode === 'dark' ? 'Escuro' : 'Claro'}
            </Text>
          </View>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.background}
          />
        </View>
      </View>

      {/* Seção de Filial */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>Selecione sua filial:</Text>
        <View style={styles.listaFiliais}>
          {filiais.map((filial) => (
            <TouchableOpacity
              key={filial}
              style={[
                styles.filialItem,
                { borderColor: theme.colors.border },
                filialSelecionada === filial && { 
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary 
                },
              ]}
              onPress={() => salvarFilial(filial)}
            >
              <Text
                style={[
                  styles.filialTexto,
                  { color: theme.colors.text.primary },
                  filialSelecionada === filial && { color: theme.colors.text.light },
                ]}
              >
                {filial}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão de Logout */}
      <View style={styles.logoutSection}>
        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  secao: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  listaFiliais: {
    gap: 8,
  },
  filialItem: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  filialTexto: {
    fontSize: 16,
    fontWeight: '500',
  },
  userInfo: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
}); 