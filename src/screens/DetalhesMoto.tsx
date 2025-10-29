import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type Props = NativeStackScreenProps<MotosStackParamList, 'DetalhesMoto'>;

export const DetalhesMoto = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { moto } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.placaContainer}>
              <View style={[styles.idBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.idText, { color: theme.colors.text.light }]}>ID: {moto.id}</Text>
              </View>
              <Text style={[styles.placa, { color: theme.colors.text.primary }]}>{moto.placa}</Text>
            </View>
            <Text style={[styles.modelo, { color: theme.colors.text.secondary }]}>
              {moto.modelo} {moto.ano}
            </Text>
            <Text style={[styles.cor, { color: theme.colors.text.secondary }]}>
              {t('moto.colorLabel')}: {moto.cor}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: moto.status === 'disponível' ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
              {t(`moto.${moto.status === 'disponível' ? 'available' : moto.status === 'ocupada' ? 'occupied' : 'maintenance'}`)}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.filialSection, { backgroundColor: theme.colors.secondaryBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>🏢 {t('moto.branch')}</Text>
            <View style={styles.filialInfo}>
              <View style={[styles.filialIdBadge, { backgroundColor: theme.colors.secondary }]}>
                <Text style={[styles.filialIdText, { color: theme.colors.text.light }]}>ID: {moto.filialId}</Text>
              </View>
              <Text style={[styles.filialName, { color: theme.colors.text.primary }]}>{moto.filialNome}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('moto.driver')}</Text>
              <Text style={[styles.value, { color: theme.colors.text.secondary }]}>{moto.condutor}</Text>
            </View>

            {moto.vaga && (
              <View style={styles.detailItem}>
                <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('moto.spot')}</Text>
                <Text style={[styles.value, { color: theme.colors.text.secondary }]}>{moto.vaga}</Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('moto.location')}</Text>
              <Text style={[styles.value, { color: theme.colors.text.secondary }]}>
                {moto.localizacao.latitude.toFixed(6)}, {moto.localizacao.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title={`✏️ ${t('moto.editMotorcycle')}`}
          onPress={() => navigation.navigate('EdicaoMoto', { moto })}
          style={styles.button}
        />
        <Button
          title={t('moto.registerMaintenance')}
          onPress={() => navigation.navigate('FormularioManutencao', { motoId: moto.id })}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title={t('moto.viewMaintenances')}
          onPress={() => navigation.navigate('ListaManutencoes')}
          variant="tertiary"
          style={styles.button}
        />
        <Button
          title={t('common.back')}
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
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  placaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  modelo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cor: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    gap: 16,
  },
  filialSection: {
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filialIdBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 45,
  },
  filialIdText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  filialName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
}); 