import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FiliaisStackParamList } from '../navigation';
import { FilialService } from '../services/filialService';
import { Filial } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { notificationService } from '../services/notifications';

type Props = NativeStackScreenProps<FiliaisStackParamList, 'FilialList'>;

export const FilialListScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFiliais();
  }, []);

  const loadFiliais = async () => {
    setLoading(true);
    try {
      const apiFiliais = await FilialService.getAll();
      setFiliais(apiFiliais);
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
      Alert.alert(t('common.error'), t('filial.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const apiFiliais = await FilialService.getAll();
      setFiliais(apiFiliais);
    } catch (error) {
      Alert.alert(t('common.error'), t('filial.updateListError'));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteFilial = async (filial: Filial) => {
    Alert.alert(
      t('filial.confirmDelete'),
      `${t('filial.deleteConfirmMessage')} "${filial.nome}"?`,
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await FilialService.delete(filial.id);
              
              // Envia notificação de exclusão
              try {
                const permissionStatus = await notificationService.getPermissionStatus();
                if (permissionStatus !== 'granted') {
                  await notificationService.requestPermissions();
                }
                
                const notificationId = await notificationService.sendTestNotification(
                  `🗑️ ${t('filial.filialDeletedNotification')}`,
                  `${filial.nome} ${t('filial.deleteSuccess')}`,
                  { screen: 'Filiais' },
                  2
                );
                
                if (notificationId) {
                  console.log('✅ Notificação de exclusão agendada:', notificationId);
                }
              } catch (notificationError) {
                console.error('❌ Erro ao enviar notificação de exclusão:', notificationError);
              }
              
              Alert.alert(t('common.success'), t('filial.deleteSuccess'));
              loadFiliais(); // Recarrega a lista
            } catch (error) {
              Alert.alert(t('common.error'), t('filial.deleteError'));
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleActive = async (filial: Filial) => {
    try {
      setLoading(true);
      await FilialService.toggleActive(filial.id);
      
      // Envia notificação de toggle
      try {
        const permissionStatus = await notificationService.getPermissionStatus();
        if (permissionStatus !== 'granted') {
          await notificationService.requestPermissions();
        }
        
        const isActivating = !filial.ativa;
        const notificationId = await notificationService.sendTestNotification(
          `🔄 ${t('filial.filialStatusChangedNotification')}`,
          `${filial.nome} ${isActivating ? t('filial.toggleActivated') : t('filial.toggleDeactivated')}`,
          { screen: 'Filiais' },
          2
        );
        
        if (notificationId) {
          console.log('✅ Notificação de toggle agendada:', notificationId);
        }
      } catch (notificationError) {
        console.error('❌ Erro ao enviar notificação de toggle:', notificationError);
      }
      
      Alert.alert(t('common.success'), `${t('filial.toggleSuccess')} ${filial.ativa ? t('filial.toggleDeactivated') : t('filial.toggleActivated')} ${t('filial.toggleSuccessSuffix')}`);
      loadFiliais(); // Recarrega a lista
    } catch (error) {
      Alert.alert(t('common.error'), t('filial.toggleError'));
    } finally {
      setLoading(false);
    }
  };

  const renderFilialItem = ({ item }: { item: Filial }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FilialForm', { filial: item })}>
      <Card>
        <View style={styles.filialInfo}>
          <View style={styles.filialDetails}>
            <View style={styles.nomeContainer}>
              <View style={[styles.idBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.idText, { color: theme.colors.text.light }]}>ID: {item.id}</Text>
              </View>
              <Text style={[styles.nome, { color: theme.colors.text.primary }]}>{item.nome}</Text>
            </View>
            <Text style={[styles.endereco, { color: theme.colors.text.secondary }]}>
              {item.endereco}, {item.cidade} - {item.estado}
            </Text>
            <Text style={[styles.cep, { color: theme.colors.text.secondary }]}>{t('filial.zipCode')}: {item.cep}</Text>
            {item.telefone && (
              <Text style={[styles.telefone, { color: theme.colors.text.secondary }]}>
                {t('filial.telLabel')}: {item.telefone}
              </Text>
            )}
          </View>
          <View style={styles.filialActions}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.ativa ? theme.colors.success : theme.colors.error }
            ]}>
              <Text style={[styles.statusText, { color: theme.colors.text.light }]}>
                {item.ativa ? t('filial.active') : t('filial.inactive')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleToggleActive(item)}
              style={[styles.toggleButton, { backgroundColor: theme.colors.warning }]}
            >
              <MaterialIcons 
                name={item.ativa ? "visibility-off" : "visibility"} 
                size={20} 
                color={theme.colors.text.light} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteFilial(item)}
              style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            >
              <MaterialIcons name="delete" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && filiais.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          {t('filial.loadingBranches')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('filial.list')}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t('filial.newBranchButton')}
          onPress={() => navigation.navigate('FilialForm', {})}
          variant="primary"
          style={styles.button}
        />
      </View>
      <FlatList
        data={filiais}
        renderItem={renderFilialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ backgroundColor: theme.colors.background }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="business" size={60} color={theme.colors.text.secondary} />
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                {t('filial.emptyList')}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.text.secondary }]}>
                {t('filial.pullToRefresh')}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    width: '100%',
  },
  list: {
    paddingBottom: 16,
  },
  filialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filialDetails: {
    flex: 1,
  },
  filialActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  idBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
  },
  idText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  endereco: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '400',
  },
  cep: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '400',
  },
  telefone: {
    fontSize: 14,
    fontWeight: '400',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
