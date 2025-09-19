import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FiliaisStackParamList } from '../navigation';
import { FilialService } from '../services/filialService';
import { Filial } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<FiliaisStackParamList, 'FilialList'>;

export const FilialListScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
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
      Alert.alert('Erro', 'Não foi possível carregar as filiais. Verifique sua conexão.');
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
      Alert.alert('Erro', 'Não foi possível atualizar a lista de filiais.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteFilial = async (filial: Filial) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a filial "${filial.nome}"?`,
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
              await FilialService.delete(filial.id);
              Alert.alert('Sucesso', 'Filial excluída com sucesso!');
              loadFiliais(); // Recarrega a lista
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a filial. Tente novamente.');
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
      Alert.alert('Sucesso', `Filial ${filial.ativa ? 'desativada' : 'ativada'} com sucesso!`);
      loadFiliais(); // Recarrega a lista
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status da filial.');
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
            <Text style={[styles.cep, { color: theme.colors.text.secondary }]}>CEP: {item.cep}</Text>
            {item.telefone && (
              <Text style={[styles.telefone, { color: theme.colors.text.secondary }]}>
                Tel: {item.telefone}
              </Text>
            )}
          </View>
          <View style={styles.filialActions}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.ativa ? theme.colors.success : theme.colors.error }
            ]}>
              <Text style={[styles.statusText, { color: theme.colors.text.light }]}>
                {item.ativa ? 'Ativa' : 'Inativa'}
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
          Carregando filiais...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Lista de Filiais</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Nova Filial"
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
                Nenhuma filial encontrada
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
