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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import type { ConfiguracoesStackParamList } from '../navigation';

type ConfiguracoesScreenNavigationProp = NativeStackNavigationProp<ConfiguracoesStackParamList>;

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
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [filialSelecionada, setFilialSelecionada] = useState<string>('');
  const navigation = useNavigation<ConfiguracoesScreenNavigationProp>();

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
      Alert.alert(t('common.success'), t('settings.selectBranchSuccess'));
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      Alert.alert(t('common.error'), t('errors.unknownError'));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.unknownError'));
            }
          },
        },
      ]
    );
  };


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.titulo, { color: theme.colors.text.primary }]}>{t('settings.title')}</Text>
      
      {/* Informações do usuário */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>{t('settings.user')}</Text>
        <Text style={[styles.userInfo, { color: theme.colors.text.secondary }]}>
          {user?.displayName || t('settings.user')}
        </Text>
        <Text style={[styles.userInfo, { color: theme.colors.text.secondary }]}>
          {user?.email}
        </Text>
      </View>
      
      {/* Seção de Idioma */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>{t('settings.language')}</Text>
        <Text style={[styles.dataInfo, { color: theme.colors.text.secondary }]}>
          {t('settings.languageDesc')}
        </Text>
        <View style={styles.languageButtons}>
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
              size={20} 
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
              size={20} 
              color={currentLanguage === 'en' ? '#FFFFFF' : theme.colors.text.primary} 
            />
            <Text style={[
              styles.languageButtonText,
              { color: currentLanguage === 'en' ? '#FFFFFF' : theme.colors.text.primary }
            ]}>
              {t('settings.english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              { 
                backgroundColor: currentLanguage === 'es' ? theme.colors.primary : theme.colors.card,
                borderColor: theme.colors.border,
                borderWidth: 1,
              }
            ]}
            onPress={() => changeLanguage('es')}
          >
            <MaterialIcons 
              name="language" 
              size={20} 
              color={currentLanguage === 'es' ? '#FFFFFF' : theme.colors.text.primary} 
            />
            <Text style={[
              styles.languageButtonText,
              { color: currentLanguage === 'es' ? '#FFFFFF' : theme.colors.text.primary }
            ]}>
              {t('settings.spanish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de Tema */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>{t('settings.appearance')}</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <MaterialIcons 
              name={theme.mode === 'dark' ? 'dark-mode' : 'light-mode'} 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>
              {theme.mode === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
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
        <Text style={[styles.subtitulo, { color: theme.colors.text.primary }]}>{t('settings.selectBranch')}</Text>
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

      {/* Seção Sobre o App */}
      <View style={[styles.secao, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[styles.aboutAppButton, { borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('SobreApp')}
        >
          <View style={styles.aboutAppButtonLeft}>
            <MaterialIcons 
              name="info-outline" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.aboutAppButtonText, { color: theme.colors.text.primary }]}>
              {t('settings.aboutApp')}
            </Text>
          </View>
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <View style={styles.logoutSection}>
        <Button
          title={t('auth.logout')}
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
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  languageButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  aboutAppButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  aboutAppButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutAppButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 