import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type Props = NativeStackScreenProps<MotosStackParamList, 'DetalhesMoto'>;

export const DetalhesMoto = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { moto } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <View style={styles.header}>
          <View>
            <Text style={[styles.placa, { color: theme.colors.text.primary }]}>{moto.placa}</Text>
            <Text style={[styles.modelo, { color: theme.colors.text.secondary }]}>{moto.modelo}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: moto.status === 'disponível' ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{moto.status}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Condutor</Text>
          <Text style={[styles.value, { color: theme.colors.text.secondary }]}>{moto.condutor}</Text>

          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Localização</Text>
          <Text style={[styles.value, { color: theme.colors.text.secondary }]}>
            Latitude: {moto.localizacao.latitude.toFixed(6)}
          </Text>
          <Text style={[styles.value, { color: theme.colors.text.secondary }]}>
            Longitude: {moto.localizacao.longitude.toFixed(6)}
          </Text>

          {moto.vaga && (
            <>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>Vaga</Text>
              <Text style={[styles.value, { color: theme.colors.text.secondary }]}>{moto.vaga}</Text>
            </>
          )}
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar Manutenção"
          onPress={() => navigation.navigate('FormularioManutencao', { motoId: moto.id })}
          style={styles.button}
        />
        <Button
          title="Ver Manutenções"
          onPress={() => navigation.navigate('ListaManutencoes')}
          variant="tertiary"
          style={styles.button}
        />
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  placa: {
    fontSize: 24,
    marginBottom: 4,
    fontWeight: '700',
  },
  modelo: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
  },
  infoSection: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
}); 