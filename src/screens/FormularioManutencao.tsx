import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Picker } from '@react-native-picker/picker';
import { TipoManutencao } from '../types';
import { colors, layout, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<MotosStackParamList, 'FormularioManutencao'>;

const tiposManutencao: TipoManutencao[] = [
  'Troca de óleo',
  'Freios',
  'Pneus',
  'Corrente',
  'Sistema elétrico',
  'Suspensão',
  'Motor',
  'Embreagem',
  'Bateria',
  'Carburador/Injeção',
  'Outro',
];

export const FormularioManutencao = ({ route, navigation }: Props) => {
  const { motoId } = route.params;
  const [tipoManutencao, setTipoManutencao] = useState<TipoManutencao>('Troca de óleo');
  const [motivoCustomizado, setMotivoCustomizado] = useState('');
  const [data, setData] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (tipoManutencao === 'Outro' && !motivoCustomizado.trim()) {
      newErrors.motivoCustomizado = 'Especifique o motivo da manutenção';
    }
    if (!data.trim()) {
      newErrors.data = 'Data é obrigatória';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      newErrors.data = 'Data inválida (formato: DD/MM/AAAA)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validate()) return;

    const manutencao = {
      id: Date.now().toString(),
      motoId,
      tipoManutencao,
      motivoCustomizado: tipoManutencao === 'Outro' ? motivoCustomizado : undefined,
      data,
      observacoes,
    };

    console.log('Manutenção registrada:', manutencao);
    Alert.alert('Sucesso', 'Manutenção registrada com sucesso!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.form}>
          <Text style={styles.title}>Registrar Manutenção</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tipo de Manutenção *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tipoManutencao}
                onValueChange={(value) => setTipoManutencao(value as TipoManutencao)}
                style={styles.picker}
              >
                {tiposManutencao.map((tipo) => (
                  <Picker.Item key={tipo} label={tipo} value={tipo} />
                ))}
              </Picker>
            </View>
          </View>

          {tipoManutencao === 'Outro' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Especifique o Motivo *</Text>
              <TextInput
                style={[styles.input, errors.motivoCustomizado && styles.inputError]}
                value={motivoCustomizado}
                onChangeText={setMotivoCustomizado}
                placeholder="Digite o motivo da manutenção"
                multiline
              />
              {errors.motivoCustomizado && (
                <Text style={styles.errorText}>{errors.motivoCustomizado}</Text>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data *</Text>
            <TextInput
              style={[styles.input, errors.data && styles.inputError]}
              value={data}
              onChangeText={setData}
              placeholder="DD/MM/AAAA"
            />
            {errors.data && (
              <Text style={styles.errorText}>{errors.data}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Digite as observações"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.botaoSalvar} 
            onPress={handleSalvar}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
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
    borderRadius: spacing.xs,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: spacing.sm,
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  botaoSalvarTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.light,
  },
}); 