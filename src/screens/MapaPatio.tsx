import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation';
import { Card } from '../components/Card';
import { StorageService } from '../services/storage';
import { Vaga, Moto } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'MapaPatio'>;

export const MapaPatio = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);

  useEffect(() => {
    async function fetchData() {
      const vagasData = await StorageService.getVagas();
      const motosData = await StorageService.getMotos();
      setVagas(vagasData);
      setMotos(motosData);
    }
    fetchData();
  }, []);

  function handleVagaPress(vaga: Vaga) {
    if (vaga.status === 'ocupada' && vaga.motoId) {
      const moto = motos.find(m => m.id === vaga.motoId);
      setMotoSelecionada(moto || null);
      setVagaSelecionada(vaga);
      setModalVisible(true);
    }
  }

  // Agrupar vagas por coluna/letra
  const colunas: { [coluna: string]: Vaga[] } = {};
  vagas.forEach(vaga => {
    const coluna = vaga.numero ? vaga.numero[0] : '?';
    if (!colunas[coluna]) colunas[coluna] = [];
    colunas[coluna].push(vaga);
  });

  // Calcular totais de vagas livres e ocupadas
  const totalLivres = vagas.filter(v => v.status === 'livre').length;
  const totalOcupadas = vagas.filter(v => v.status === 'ocupada').length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('mapPatio.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{t('mapPatio.subtitle')}</Text>
        
        <View style={styles.legendaContainer}>
          <View style={styles.legendaItem}>
            <View style={[styles.quadrado, { backgroundColor: theme.colors.success }]} />
            <Text style={[styles.legendaText, { color: theme.colors.text.primary }]}>{t('mapPatio.free')} ({totalLivres})</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.quadrado, { backgroundColor: theme.colors.error }]} />
            <Text style={[styles.legendaText, { color: theme.colors.text.primary }]}>{t('mapPatio.occupied')} ({totalOcupadas})</Text>
          </View>
        </View>

        <View style={styles.mapaContainer}>
          {Object.keys(colunas).sort().map(coluna => (
            <View key={coluna} style={styles.colunaContainer}>
              <Text style={[styles.colunaLabel, { color: theme.colors.primary }]}>{coluna}</Text>
              <View style={styles.colunaVagas}>
                {colunas[coluna].map(vaga => (
                  <TouchableOpacity
                    key={vaga.id}
                    style={[
                      styles.vaga,
                      { backgroundColor: vaga.status === 'livre' ? theme.colors.success : theme.colors.error }
                    ]}
                    onPress={() => handleVagaPress(vaga)}
                  >
                    <Text style={[styles.vagaText, { color: theme.colors.text.light }]}>{vaga.numero}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Card>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>{t('mapPatio.motorcycleInfo')}</Text>
            {motoSelecionada ? (
              <>
                <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('moto.plate')}: <Text style={[styles.modalValue, { color: theme.colors.primary }]}>{motoSelecionada.placa}</Text></Text>
                <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('moto.model')}: <Text style={[styles.modalValue, { color: theme.colors.primary }]}>{motoSelecionada.modelo}</Text></Text>
                <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('moto.driver')}: <Text style={[styles.modalValue, { color: theme.colors.primary }]}>{motoSelecionada.condutor}</Text></Text>
                <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('moto.statusLabel')}: <Text style={[styles.modalValue, { color: theme.colors.primary }]}>{t(`moto.${motoSelecionada.status === 'disponível' ? 'available' : motoSelecionada.status === 'ocupada' ? 'occupied' : 'maintenance'}`)}</Text></Text>
                <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('moto.spot')}: <Text style={[styles.modalValue, { color: theme.colors.primary }]}>{vagaSelecionada?.numero}</Text></Text>
                <Pressable style={[styles.modalButtonSecondary, { backgroundColor: theme.colors.primary }]} onPress={() => {
                  setModalVisible(false);
                  navigation.getParent()?.navigate('Motos', {
                    screen: 'DetalhesMoto',
                    params: { moto: motoSelecionada }
                  });
                }}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.text.light }]}>{t('mapPatio.viewDetails')}</Text>
                </Pressable>
                <Pressable style={[styles.modalButton, { backgroundColor: theme.colors.primary }]} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.text.light }]}>{t('mapPatio.close')}</Text>
                </Pressable>
              </>
            ) : (
              <Text style={[styles.modalLabel, { color: theme.colors.text.primary }]}>{t('mapPatio.motorcycleNotFound')}</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
    fontWeight: '600',
  },
  legendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendaText: {
    fontSize: 16,
    fontWeight: '400',
  },
  quadrado: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  mapaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  colunaContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  colunaLabel: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: '600',
  },
  colunaVagas: {
    flexDirection: 'column',
    gap: 8,
  },
  vaga: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  vagaText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 8,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: '700',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '400',
  },
  modalValue: {
    fontWeight: '700',
  },
  modalButton: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonSecondary: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
}); 