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

type Props = NativeStackScreenProps<MotosStackParamList, 'CadastroMoto'>;

export const CadastroMoto = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [condutor, setCondutor] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [vaga, setVaga] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!condutor.trim()) {
      newErrors.condutor = 'Nome do condutor é obrigatório';
    }
    if (!modelo.trim()) {
      newErrors.modelo = 'Modelo da moto é obrigatório';
    }
    if (!placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (!/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/.test(placa)) {
      newErrors.placa = 'Placa inválida (formato: ABC1D23)';
    }
    if (!vaga.trim()) {
      newErrors.vaga = 'Número da vaga é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const novaMoto = {
        condutor,
        modelo,
        placa,
        vaga,
        localizacao: { latitude: 0, longitude: 0 },
      };

      // Tenta salvar na API primeiro
      try {
        await MotoService.create(novaMoto);
        Alert.alert('Sucesso', 'Moto cadastrada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (apiError) {
        console.warn('Erro ao salvar na API, salvando localmente:', apiError);
        
        // Fallback para salvamento local
        const motoLocal = {
          id: Date.now().toString(),
          condutor,
          modelo,
          placa,
          vaga,
          status: 'disponível' as 'disponível',
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

        <View style={styles.form}>
          <Input
            label="Nome do Condutor *"
            value={condutor}
            onChangeText={setCondutor}
            placeholder="Digite o nome do condutor"
            error={errors.condutor}
          />

          <Input
            label="Modelo da Moto *"
            value={modelo}
            onChangeText={setModelo}
            placeholder="Digite o modelo da moto"
            error={errors.modelo}
          />

          <Input
            label="Placa *"
            value={placa}
            onChangeText={(text) => setPlaca(text.toUpperCase())}
            placeholder="ABC1D23"
            error={errors.placa}
            maxLength={7}
          />

          <Input
            label="Número da Vaga *"
            value={vaga}
            onChangeText={setVaga}
            placeholder="Digite o número da vaga"
            error={errors.vaga}
            keyboardType="numeric"
          />
        </View>

        {(condutor || modelo || placa || vaga) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>Preview do Cadastro:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              {condutor && `Condutor: ${condutor}\n`}
              {modelo && `Modelo: ${modelo}\n`}
              {placa && `Placa: ${placa}\n`}
              {vaga && `Vaga: ${vaga}`}
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
    marginBottom: 24,
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