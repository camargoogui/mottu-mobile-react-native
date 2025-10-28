import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { StorageService } from '../services/storage';
import { MotoService } from '../services/motoService';
import { useTheme } from '../contexts/ThemeContext';
import { notificationService } from '../services/notifications';

type Props = NativeStackScreenProps<MotosStackParamList, 'CadastroMoto'>;

export const CadastroMoto = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [filialId, setFilialId] = useState('');
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

  const handleSalvar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const novaMoto = {
        placa: placa.trim().toUpperCase(),
        modelo: modelo.trim(),
        ano: parseInt(ano),
        cor: cor.trim(),
        filialId: parseInt(filialId),
      };

      // Tenta salvar na API primeiro
      try {
        await MotoService.create(novaMoto);
        
        // Envia notificação de sucesso
        await notificationService.sendTestNotification(
          '🏍️ Nova Moto Cadastrada',
          `${modelo} - Placa: ${placa.trim().toUpperCase()} foi cadastrada com sucesso!`,
          { screen: 'ListaMotos' },
          2 // 2 segundos de delay
        );
        
        Alert.alert('Sucesso', 'Moto cadastrada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (apiError) {
        console.warn('Erro ao salvar na API, salvando localmente:', apiError);
        
        // Fallback para salvamento local
        const motoLocal = {
          id: Date.now().toString(),
          condutor: 'N/A', // Valor padrão para compatibilidade local
          modelo: modelo.trim(),
          placa: placa.trim().toUpperCase(),
          ano: parseInt(ano),
          cor: cor.trim(),
          filialId: parseInt(filialId),
          filialNome: `Filial ${filialId}`, // Valor padrão
          status: 'disponível' as 'disponível',
          vaga: 'N/A', // Valor padrão para compatibilidade local
          localizacao: { latitude: 0, longitude: 0 },
        };

        await StorageService.saveMoto(motoLocal);
        Alert.alert(
          'Aviso', 
          'Não foi possível conectar com o servidor. A moto foi salva localmente.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Erro ao salvar moto:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a moto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Cadastrar Nova Moto</Text>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 Campos Obrigatórios
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            • Placa (exatamente 7 caracteres){'\n'}
            • Modelo (2-50 caracteres){'\n'}
            • Ano (1900-2030){'\n'}
            • Cor (3-30 caracteres){'\n'}
            • Filial (ID válido)
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
        </View>

        {(modelo || placa || ano || cor || filialId) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>Preview do Cadastro:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              {placa && `🏍️ Placa: ${placa}\n`}
              {modelo && `📋 Modelo: ${modelo}\n`}
              {ano && `📅 Ano: ${ano}\n`}
              {cor && `🎨 Cor: ${cor}\n`}
              {filialId && `📍 Filial ID: ${filialId}`}
            </Text>
          </View>
        )}

        <Button
          title={loading ? "Salvando..." : "Salvar Moto"}
          onPress={handleSalvar}
          variant="primary"
          disabled={loading}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              Cadastrando moto...
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
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