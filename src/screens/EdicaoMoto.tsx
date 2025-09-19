import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { MotoService } from '../services/motoService';
import { useTheme } from '../contexts/ThemeContext';

// Função para converter status da UI para número da API
const statusToApiNumber = (status: 'disponível' | 'ocupada' | 'manutenção'): number => {
  switch (status) {
    case 'disponível': return 0;
    case 'ocupada': return 1;
    case 'manutenção': return 2;
    default: return 0; // Default para disponível
  }
};

type Props = NativeStackScreenProps<MotosStackParamList, 'EdicaoMoto'>;

export const EdicaoMoto = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { moto } = route.params;
  
  const [modelo, setModelo] = useState(moto.modelo);
  const [placa, setPlaca] = useState(moto.placa);
  const [ano, setAno] = useState(moto.ano.toString());
  const [cor, setCor] = useState(moto.cor);
  const [filialId, setFilialId] = useState(moto.filialId.toString());
  const [status, setStatus] = useState(moto.status);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Placa (obrigatória, exatamente 7 caracteres)
    if (!placa.trim()) {
      newErrors.placa = '❌ Placa é obrigatória';
    } else if (placa.trim().length !== 7) {
      newErrors.placa = '❌ Placa deve ter exatamente 7 caracteres (ex: ABC1234)';
    }

    // Modelo (obrigatório, 2-50 caracteres)
    if (!modelo.trim()) {
      newErrors.modelo = '❌ Modelo da moto é obrigatório';
    } else if (modelo.trim().length < 2) {
      newErrors.modelo = '❌ Modelo deve ter pelo menos 2 caracteres';
    } else if (modelo.trim().length > 50) {
      newErrors.modelo = '❌ Modelo deve ter no máximo 50 caracteres';
    }

    // Ano (obrigatório, 1900-2030)
    const anoNum = parseInt(ano);
    if (!ano.trim()) {
      newErrors.ano = '❌ Ano é obrigatório';
    } else if (isNaN(anoNum) || anoNum < 1900 || anoNum > 2030) {
      newErrors.ano = '❌ Ano deve estar entre 1900 e 2030';
    }

    // Cor (obrigatória, 3-30 caracteres)
    if (!cor.trim()) {
      newErrors.cor = '❌ Cor é obrigatória';
    } else if (cor.trim().length < 3) {
      newErrors.cor = '❌ Cor deve ter pelo menos 3 caracteres';
    } else if (cor.trim().length > 30) {
      newErrors.cor = '❌ Cor deve ter no máximo 30 caracteres';
    }

    // Filial ID (obrigatório, maior que 0)
    const filialNum = parseInt(filialId);
    if (!filialId.trim()) {
      newErrors.filialId = '❌ Filial é obrigatória';
    } else if (isNaN(filialNum) || filialNum <= 0) {
      newErrors.filialId = '❌ Selecione uma filial válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAtualizar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const motoAtualizada = {
        id: moto.id,
        placa: placa.trim().toUpperCase(),
        modelo: modelo.trim(),
        ano: parseInt(ano),
        cor: cor.trim(),
        filialId: parseInt(filialId),
        status: statusToApiNumber(status), // Converter status para número da API
      };

      console.log('🔍 Placa original:', moto.placa);
      console.log('🔍 Placa nova:', placa.trim().toUpperCase());
      console.log('🔍 Placa mudou?', moto.placa !== placa.trim().toUpperCase());
      console.log('🔄 Status enviado para API:', `${status} -> ${statusToApiNumber(status)}`);

      await MotoService.update(moto.id, motoAtualizada);
      Alert.alert('Sucesso', 'Moto atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a moto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const StatusPicker = () => (
    <View style={styles.statusContainer}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Status *</Text>
      <View style={styles.statusButtons}>
        {(['disponível', 'ocupada', 'manutenção'] as const).map((statusOption) => (
          <Button
            key={statusOption}
            title={statusOption}
            onPress={() => setStatus(statusOption)}
            variant={status === statusOption ? 'primary' : 'secondary'}
            style={styles.statusButton}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Editar Moto</Text>

        <View style={[styles.currentMoto, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.currentTitle, { color: theme.colors.text.primary }]}>
            📝 Editando: {moto.placa}
          </Text>
          <Text style={[styles.currentText, { color: theme.colors.text.secondary }]}>
            {moto.modelo} {moto.ano} - {moto.cor}
          </Text>
        </View>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 Campos Obrigatórios
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            • Placa (exatamente 7 caracteres){'\n'}
            • Modelo (2-50 caracteres){'\n'}
            • Ano (1900-2030){'\n'}
            • Cor (3-30 caracteres){'\n'}
            • Filial (ID válido){'\n'}
            • Status (disponível/ocupada/manutenção)
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Placa *"
            value={placa}
            onChangeText={(text) => setPlaca(text.toUpperCase())}
            placeholder="ABC1234"
            error={errors.placa}
            maxLength={7}
          />

          <Input
            label="Modelo da Moto *"
            value={modelo}
            onChangeText={setModelo}
            placeholder="Honda CG 160, Yamaha XJ6, etc."
            error={errors.modelo}
            maxLength={50}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Ano *"
                value={ano}
                onChangeText={setAno}
                placeholder="2024"
                error={errors.ano}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Cor *"
                value={cor}
                onChangeText={setCor}
                placeholder="Azul, Vermelha, etc."
                error={errors.cor}
                maxLength={30}
              />
            </View>
          </View>

          <Input
            label="ID da Filial *"
            value={filialId}
            onChangeText={setFilialId}
            placeholder="3, 4, 5, etc."
            error={errors.filialId}
            keyboardType="numeric"
            helperText="💡 Veja o ID na lista de filiais"
          />

          <StatusPicker />
        </View>

        {(modelo || placa || ano || cor || filialId) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>Preview das Alterações:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              🏍️ Placa: {placa}{'\n'}
              📋 Modelo: {modelo}{'\n'}
              📅 Ano: {ano}{'\n'}
              🎨 Cor: {cor}{'\n'}
              📍 Filial ID: {filialId}{'\n'}
              🔄 Status: {status}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Atualizando..." : "Atualizar Moto"}
            onPress={handleAtualizar}
            variant="primary"
            disabled={loading}
            style={styles.updateButton}
          />
          
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="secondary"
            disabled={loading}
          />
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              Atualizando moto...
            </Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentMoto: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentText: {
    fontSize: 14,
  },
  helpSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  statusContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
  },
  preview: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '400',
  },
  buttonContainer: {
    gap: 12,
  },
  updateButton: {
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
