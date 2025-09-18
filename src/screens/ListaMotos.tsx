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
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MotosStackParamList, 'ListaMotosScreen'>;

export const ListaMotos = ({ navigation }: Props) => {
  const { theme } = useTheme();
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
        'Aviso',
        'Não foi possível conectar com o servidor. Exibindo dados locais.',
        [{ text: 'OK' }]
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
      Alert.alert('Erro', 'Não foi possível atualizar a lista de motos.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteMoto = async (moto: Moto) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a moto ${moto.placa}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await MotoService.delete(moto.id);
              Alert.alert('Sucesso', 'Moto excluída com sucesso!');
              loadMotos(); // Recarrega a lista
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a moto. Tente novamente.');
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
            <Text style={[styles.placa, { color: theme.colors.text.primary }]}>{item.placa}</Text>
            <Text style={[styles.modelo, { color: theme.colors.text.secondary }]}>{item.modelo}</Text>
            <Text style={[styles.condutor, { color: theme.colors.text.secondary }]}>Condutor: {item.condutor}</Text>
          </View>
          <View style={styles.motoActions}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'disponível' ? theme.colors.success : theme.colors.error }
            ]}>
              <Text style={[styles.statusText, { color: theme.colors.text.light }]}>{item.status}</Text>
            </View>
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
          Carregando motos...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Lista de Motos</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Moto"
          onPress={() => navigation.navigate('CadastroMoto')}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Ver Manutenções"
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
                Nenhuma moto encontrada
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.text.secondary }]}>
                Puxe para baixo para atualizar
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
  placa: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: '700',
  },
  modelo: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '400',
  },
  condutor: {
    fontSize: 14,
    fontWeight: '400',
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