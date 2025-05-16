import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesMoto'>;

export const DetalhesMoto = ({ route, navigation }: Props) => {
  const { moto } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.header}>
          <View>
            <Text style={styles.placa}>{moto.placa}</Text>
            <Text style={styles.modelo}>{moto.modelo}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: moto.status === 'disponível' ? colors.success : colors.error }
          ]}>
            <Text style={styles.statusText}>{moto.status}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Condutor</Text>
          <Text style={styles.value}>{moto.condutor}</Text>

          <Text style={styles.label}>Localização</Text>
          <Text style={styles.value}>
            Latitude: {moto.localizacao.latitude.toFixed(6)}
          </Text>
          <Text style={styles.value}>
            Longitude: {moto.localizacao.longitude.toFixed(6)}
          </Text>

          {moto.vaga && (
            <>
              <Text style={styles.label}>Vaga</Text>
              <Text style={styles.value}>{moto.vaga}</Text>
            </>
          )}
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar Manutenção"
          onPress={() => navigation.navigate('FormularioManutencao', { motoId: moto.id })}
        />
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  placa: {
    ...typography.header,
    marginBottom: spacing.xs,
  },
  modelo: {
    ...typography.subheader,
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
  infoSection: {
    gap: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  value: {
    ...typography.body,
    color: colors.text.secondary,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
}); 