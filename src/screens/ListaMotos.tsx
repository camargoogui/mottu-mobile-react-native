import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { StorageService } from '../services/storage';
import { MotoService } from '../services/motoService';
import { Moto } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MotosStackParamList, 'ListaMotosScreen'>;

export const ListaMotos = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMotos();
  }, []);

  const loadMotos = async () => {
    setLoading(true);
    try {
      // Tenta carregar da API primeiro
      const apiMotos = await MotoService.getAll();
      setMotos(apiMotos);
    } catch (error) {
      console.warn('Erro ao carregar da API, usando dados locais:', error);
      Alert.alert(
        t('common.error'),
        t('moto.connectionWarning'),
        [{ text: t('common.ok') }]
      );
      // Fallback para dados locais
      const localMotos = await StorageService.getMotos();
      setMotos(localMotos);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const apiMotos = await MotoService.getAll();
      setMotos(apiMotos);
    } catch (error) {
      Alert.alert(t('common.error'), t('moto.updateListError'));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteMoto = async (moto: Moto) => {
    Alert.alert(
      t('moto.confirmDelete'),
      `${t('moto.deleteConfirmMessage')} ${moto.placa}?`,
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
              await MotoService.delete(moto.id);
              Alert.alert(t('common.success'), t('moto.deleteSuccess'));
              loadMotos(); // Recarrega a lista
            } catch (error) {
              Alert.alert(t('common.error'), t('moto.deleteError'));
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderMotoItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetalhesMoto', { moto: item })}>
      <Card>
        <View style={styles.motoInfo}>
          <View style={styles.motoDetails}>
            <View style={styles.placaContainer}>
              <View style={[styles.idBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.idText, { color: theme.colors.text.light }]}>ID: {item.id}</Text>
              </View>
              <Text style={[styles.placa, { color: theme.colors.text.primary }]}>{item.placa}</Text>
            </View>
            <Text style={[styles.modelo, { color: theme.colors.text.secondary }]}>{item.modelo} {item.ano}</Text>
            <Text style={[styles.cor, { color: theme.colors.text.secondary }]}>{t('moto.colorLabel')}: {item.cor}</Text>
            <Text style={[styles.filial, { color: theme.colors.text.secondary }]}>📍 {item.filialNome}</Text>
          </View>
          <View style={styles.motoActions}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'disponível' ? theme.colors.success : theme.colors.error }
            ]}>
              <Text style={[styles.statusText, { color: theme.colors.text.light }]}>
                {t(`moto.${item.status === 'disponível' ? 'available' : item.status === 'ocupada' ? 'occupied' : 'maintenance'}`)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EdicaoMoto', { moto: item })}
              style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            >
              <MaterialIcons name="edit" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteMoto(item)}
              style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            >
              <MaterialIcons name="delete" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && motos.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          {t('moto.loadingMotorcycles')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('moto.list')}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t('moto.registerMotorcycle')}
          onPress={() => navigation.navigate('CadastroMoto')}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title={t('moto.viewMaintenances')}
          onPress={() => navigation.navigate('ListaManutencoes')}
          variant="tertiary"
          style={styles.button}
        />
      </View>
      <FlatList
        data={motos}
        renderItem={renderMotoItem}
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
              <MaterialIcons name="motorcycle" size={60} color={theme.colors.text.secondary} />
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                {t('moto.emptyList')}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.text.secondary }]}>
                {t('moto.pullToRefresh')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  list: {
    paddingBottom: 16,
  },
  motoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motoDetails: {
    flex: 1,
  },
  motoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placaContainer: {
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
  placa: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  modelo: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  cor: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '400',
  },
  filial: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
  },
  editButton: {
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