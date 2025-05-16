import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { StorageService } from '../services/storage';
import { colors, layout, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<MotosStackParamList, 'CadastroMoto'>;

export const CadastroMoto = ({ navigation }: Props) => {
  const [condutor, setCondutor] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [vaga, setVaga] = useState('');
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

    const novaMoto = {
      id: Date.now().toString(),
      condutor,
      modelo,
      placa,
      vaga,
      status: 'disponível' as 'disponível',
      localizacao: { latitude: 0, longitude: 0 },
    };

    await StorageService.saveMoto(novaMoto);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Cadastrar Nova Moto</Text>

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
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview do Cadastro:</Text>
            <Text style={styles.previewText}>
              {condutor && `Condutor: ${condutor}\n`}
              {modelo && `Modelo: ${modelo}\n`}
              {placa && `Placa: ${placa}\n`}
              {vaga && `Vaga: ${vaga}`}
            </Text>
          </View>
        )}

        <Button
          title="Salvar Moto"
          onPress={handleSalvar}
          variant="primary"
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  preview: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: spacing.xs,
    marginBottom: spacing.md,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    backgroundColor: colors.card,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.light,
  },
}); 