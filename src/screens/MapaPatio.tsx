import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation';
import { Card } from '../components/Card';
import { colors, layout, spacing, typography, borderRadius } from '../theme';
import { StorageService } from '../services/storage';
import { Vaga, Moto } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'MapaPatio'>;

export const MapaPatio = ({ navigation }: Props) => {
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
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Mapa do Pátio</Text>
        <Text style={styles.subtitle}>Status das Vagas em Tempo Real</Text>
        
        <View style={styles.legendaContainer}>
          <View style={styles.legendaItem}>
            <View style={[styles.quadrado, { backgroundColor: colors.success }]} />
            <Text style={styles.legendaText}>Livre ({totalLivres})</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.quadrado, { backgroundColor: colors.error }]} />
            <Text style={styles.legendaText}>Ocupada ({totalOcupadas})</Text>
          </View>
        </View>

        <View style={styles.mapaContainer}>
          {Object.keys(colunas).sort().map(coluna => (
            <View key={coluna} style={styles.colunaContainer}>
              <Text style={styles.colunaLabel}>{coluna}</Text>
              <View style={styles.colunaVagas}>
                {colunas[coluna].map(vaga => (
                  <TouchableOpacity
                    key={vaga.id}
                    style={[
                      styles.vaga,
                      { backgroundColor: vaga.status === 'livre' ? colors.success : colors.error }
                    ]}
                    onPress={() => handleVagaPress(vaga)}
                  >
                    <Text style={styles.vagaText}>{vaga.numero}</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações da Moto</Text>
            {motoSelecionada ? (
              <>
                <Text style={styles.modalLabel}>Placa: <Text style={styles.modalValue}>{motoSelecionada.placa}</Text></Text>
                <Text style={styles.modalLabel}>Modelo: <Text style={styles.modalValue}>{motoSelecionada.modelo}</Text></Text>
                <Text style={styles.modalLabel}>Condutor: <Text style={styles.modalValue}>{motoSelecionada.condutor}</Text></Text>
                <Text style={styles.modalLabel}>Status: <Text style={styles.modalValue}>{motoSelecionada.status}</Text></Text>
                <Text style={styles.modalLabel}>Vaga: <Text style={styles.modalValue}>{vagaSelecionada?.numero}</Text></Text>
                <Pressable style={styles.modalButtonSecondary} onPress={() => {
                  setModalVisible(false);
                  navigation.getParent()?.navigate('Motos', {
                    screen: 'DetalhesMoto',
                    params: { moto: motoSelecionada }
                  });
                }}>
                  <Text style={styles.modalButtonText}>Ver detalhes</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.modalLabel}>Moto não encontrada.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    padding: spacing.md,
  },
  title: {
    ...typography.header,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.subheader,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  legendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
    gap: spacing.lg,
    justifyContent: 'center',
  },
  colunaContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  colunaLabel: {
    ...typography.subheader,
    color: colors.primary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  colunaVagas: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  vaga: {
    width: 60,
    height: 60,
    borderRadius: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  vagaText: {
    ...typography.caption,
    color: colors.text.light,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.header,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  modalLabel: {
    ...typography.body,
    marginBottom: spacing.xs,
    fontWeight: '400',
  },
  modalValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  modalButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  modalButtonSecondary: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  modalButtonText: {
    color: colors.text.light,
    fontWeight: '700',
    fontSize: 16,
  },
}); 