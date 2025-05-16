import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { StorageService } from '../services/storage';
import { Moto } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Text } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<MotosStackParamList, 'ListaMotosScreen'>;

export const ListaMotos = ({ navigation }: Props) => {
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
            <Text style={styles.placa}>{item.placa}</Text>
            <Text style={styles.modelo}>{item.modelo}</Text>
            <Text style={styles.condutor}>Condutor: {item.condutor}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'disponível' ? colors.success : colors.error }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Motos</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Moto"
          onPress={() => navigation.navigate('CadastroMoto')}
          variant="secondary"
        />
      </View>
      <FlatList
        data={motos}
        renderItem={renderMotoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.header,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.md,
  },
  motoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placa: {
    ...typography.subheader,
    marginBottom: spacing.xs,
  },
  modelo: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  condutor: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.text.light,
  },
}); 