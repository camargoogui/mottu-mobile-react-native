import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { StorageService } from '../services/storage';
import { Manutencao, Moto } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MotosStackParamList, 'ListaManutencoes'>;

interface ManutencaoComMoto extends Manutencao {
  moto: Moto;
}

export const ListaManutencoes = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [manutencoes, setManutencoes] = useState<ManutencaoComMoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadManutencoes();
  }, []);

  const loadManutencoes = async () => {
    try {
      setLoading(true);
      const [manutencoesData, motosData] = await Promise.all([
        StorageService.getManutencoes(),
        StorageService.getMotos()
      ]);

      // Combinar manutenções com dados da moto
      const manutencoesComMoto: ManutencaoComMoto[] = manutencoesData.map(manutencao => {
        const moto = motosData.find(m => m.id === manutencao.motoId);
        return {
          ...manutencao,
          moto: moto || {
            id: manutencao.motoId,
            condutor: 'Moto não encontrada',
            modelo: 'N/A',
            placa: 'N/A',
            ano: 0,
            cor: 'N/A',
            filialId: 0,
            filialNome: 'N/A',
            status: 'disponível' as const,
            localizacao: { latitude: 0, longitude: 0 }
          }
        };
      });

      // Ordenar por data (mais recente primeiro)
      manutencoesComMoto.sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-'));
        const dateB = new Date(b.data.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

      setManutencoes(manutencoesComMoto);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      Alert.alert('Erro', 'Erro ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadManutencoes();
    setRefreshing(false);
  };

  const handleDeleteManutencao = (manutencaoId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta manutenção?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteManutencao(manutencaoId);
              await loadManutencoes();
              Alert.alert('Sucesso', 'Manutenção excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir manutenção:', error);
              Alert.alert('Erro', 'Erro ao excluir manutenção');
            }
          }
        }
      ]
    );
  };

  const getTipoManutencaoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Troca de óleo': return 'oil-barrel';
      case 'Freios': return 'stop';
      case 'Pneus': return 'tire-repair';
      case 'Corrente': return 'link';
      case 'Sistema elétrico': return 'electrical-services';
      case 'Suspensão': return 'settings';
      case 'Motor': return 'build';
      case 'Embreagem': return 'settings';
      case 'Bateria': return 'battery-full';
      case 'Carburador/Injeção': return 'precision-manufacturing';
      default: return 'build';
    }
  };

  const getTipoManutencaoColor = (tipo: string) => {
    switch (tipo) {
      case 'Troca de óleo': return theme.colors.systemBlue;
      case 'Freios': return theme.colors.systemRed;
      case 'Pneus': return theme.colors.systemOrange;
      case 'Corrente': return theme.colors.systemPurple;
      case 'Sistema elétrico': return theme.colors.systemYellow;
      case 'Suspensão': return theme.colors.systemTeal;
      case 'Motor': return theme.colors.systemRed;
      case 'Embreagem': return theme.colors.systemIndigo;
      case 'Bateria': return theme.colors.systemGreen;
      case 'Carburador/Injeção': return theme.colors.systemPink;
      default: return theme.colors.primary;
    }
  };

  const renderManutencaoItem = ({ item }: { item: ManutencaoComMoto }) => (
    <Card style={styles.manutencaoCard}>
      <View style={styles.manutencaoHeader}>
        <View style={styles.manutencaoInfo}>
          <View style={styles.tipoContainer}>
            <MaterialIcons 
              name={getTipoManutencaoIcon(item.tipoManutencao)} 
              size={24} 
              color={getTipoManutencaoColor(item.tipoManutencao)} 
            />
            <Text style={[styles.tipoManutencao, { color: theme.colors.label }]}>
              {item.tipoManutencao}
            </Text>
          </View>
          <Text style={[styles.motoInfo, { color: theme.colors.secondaryLabel }]}>
            {item.moto.placa} - {item.moto.modelo}
          </Text>
          <Text style={[styles.condutorInfo, { color: theme.colors.tertiaryLabel }]}>
            Condutor: {item.moto.condutor}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleDeleteManutencao(item.id)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.manutencaoDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color={theme.colors.secondaryLabel} />
          <Text style={[styles.detailText, { color: theme.colors.label }]}>
            {item.data}
          </Text>
        </View>
        
        {item.observacoes && (
          <View style={styles.observacoesContainer}>
            <MaterialIcons name="notes" size={16} color={theme.colors.secondaryLabel} />
            <Text style={[styles.observacoesText, { color: theme.colors.secondaryLabel }]}>
              {item.observacoes}
            </Text>
          </View>
        )}

        {item.motivoCustomizado && (
          <View style={styles.motivoContainer}>
            <MaterialIcons name="info" size={16} color={theme.colors.info} />
            <Text style={[styles.motivoText, { color: theme.colors.info }]}>
              {item.motivoCustomizado}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons 
        name="build" 
        size={64} 
        color={theme.colors.secondaryLabel} 
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.label }]}>
        Nenhuma manutenção registrada
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.secondaryLabel }]}>
        As manutenções registradas aparecerão aqui
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.label }]}>
          Carregando manutenções...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.label }]}>
          Manutenções Registradas
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondaryLabel }]}>
          {manutencoes.length} manutenção{manutencoes.length !== 1 ? 'ões' : ''}
        </Text>
      </View>

      <FlatList
        data={manutencoes}
        renderItem={renderManutencaoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 34,
    letterSpacing: 0.36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  manutencaoCard: {
    marginBottom: 12,
  },
  manutencaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  manutencaoInfo: {
    flex: 1,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tipoManutencao: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
    marginLeft: 8,
  },
  motoInfo: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
    marginBottom: 2,
  },
  condutorInfo: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  manutencaoDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  observacoesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  observacoesText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
    fontStyle: 'italic',
  },
  motivoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  motivoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0.35,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
