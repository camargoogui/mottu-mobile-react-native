import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { StorageService } from '../services/storage';
import { Moto } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type Props = NativeStackScreenProps<MotosStackParamList, 'ListaMotosScreen'>;

export const ListaMotos = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [motos, setMotos] = useState<Moto[]>([]);

  useEffect(() => {
    loadMotos();
  }, []);

  const loadMotos = async () => {
    const data = await StorageService.getMotos();
    setMotos(data);
  };

  const renderMotoItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetalhesMoto', { moto: item })}>
      <Card>
        <View style={styles.motoInfo}>
          <View>
            <Text style={[styles.placa, { color: theme.colors.text.primary }]}>{item.placa}</Text>
            <Text style={[styles.modelo, { color: theme.colors.text.secondary }]}>{item.modelo}</Text>
            <Text style={[styles.condutor, { color: theme.colors.text.secondary }]}>Condutor: {item.condutor}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'disponível' ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={[styles.statusText, { color: theme.colors.text.light }]}>{item.status}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
}); 