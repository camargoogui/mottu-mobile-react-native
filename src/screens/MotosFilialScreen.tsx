import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FiliaisStackParamList } from '../navigation';
import { MotoService } from '../services/motoService';
import { Moto, Filial } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<FiliaisStackParamList, 'MotosFilial'>;

export const MotosFilialScreen = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { filial } = route.params;
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: `Motos - ${filial.nome}`,
    });
    loadMotosFilial();
  }, [navigation, filial]);

  const loadMotosFilial = async () => {
    setLoading(true);
    try {
      const motosFilial = await MotoService.getMotosByFilialId(filial.id);
      setMotos(motosFilial);
    } catch (error) {
      console.error('Erro ao carregar motos da filial:', error);
      Alert.alert('Erro', 'Não foi possível carregar as motos desta filial. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const motosFilial = await MotoService.getMotosByFilialId(filial.id);
      setMotos(motosFilial);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a lista de motos.');
    } finally {
      setRefreshing(false);
    }
  }, [filial.id]);

  const renderMotoItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity onPress={() => {
      // Navegar para detalhes da moto na stack de motos
      // Como estamos na stack de filiais, vamos só mostrar um alert por enquanto
      Alert.alert(
        'Detalhes da Moto',
        `Placa: ${item.placa}\nModelo: ${item.modelo}\nAno: ${item.ano}\nCor: ${item.cor}\nStatus: ${item.status}`,
        [{ text: 'OK' }]
      );
    }}>
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
            <Text style={[styles.cor, { color: theme.colors.text.secondary }]}>Cor: {item.cor}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'disponível' ? theme.colors.success : theme.colors.error }
              ]}>
                <Text style={[styles.statusText, { color: theme.colors.text.light }]}>{item.status}</Text>
              </View>
            </View>
          </View>
          <View style={styles.motoActions}>
            <MaterialIcons 
              name="motorcycle" 
              size={24} 
              color={theme.colors.primary}
            />
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
          Carregando motos da filial...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header com informações da filial */}
      <Card style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <MaterialIcons name="business" size={24} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.filialNome, { color: theme.colors.text.primary }]}>{filial.nome}</Text>
            <Text style={[styles.filialEndereco, { color: theme.colors.text.secondary }]}>
              {filial.endereco}, {filial.cidade} - {filial.estado}
            </Text>
          </View>
        </View>
        <View style={styles.estatisticas}>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: theme.colors.primary }]}>{motos.length}</Text>
            <Text style={[styles.estatisticaLabel, { color: theme.colors.text.secondary }]}>Total</Text>
          </View>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: theme.colors.success }]}>
              {motos.filter(m => m.status === 'disponível').length}
            </Text>
            <Text style={[styles.estatisticaLabel, { color: theme.colors.text.secondary }]}>Disponíveis</Text>
          </View>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: theme.colors.error }]}>
              {motos.filter(m => m.status === 'manutenção').length}
            </Text>
            <Text style={[styles.estatisticaLabel, { color: theme.colors.text.secondary }]}>Manutenção</Text>
          </View>
        </View>
      </Card>

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
                Esta filial não possui motos cadastradas
              </Text>
              <Text style={[styles.emptyHint, { color: theme.colors.text.secondary }]}>
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
  headerCard: {
    marginBottom: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  filialNome: {
    fontSize: 18,
    fontWeight: '700',
  },
  filialEndereco: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  estatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  estatisticaItem: {
    alignItems: 'center',
  },
  estatisticaNumero: {
    fontSize: 24,
    fontWeight: '700',
  },
  estatisticaLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
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
    padding: 8,
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
    marginBottom: 8,
    fontWeight: '400',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyHint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
