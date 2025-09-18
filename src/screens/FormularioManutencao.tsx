import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Picker } from '@react-native-picker/picker';
import { TipoManutencao } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { StorageService } from '../services/storage';

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
  const { theme } = useTheme();
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

  const handleSalvar = async () => {
    if (!validate()) return;

    const manutencao = {
      id: Date.now().toString(),
      motoId,
      tipoManutencao,
      motivoCustomizado: tipoManutencao === 'Outro' ? motivoCustomizado : undefined,
      data,
      observacoes,
    };

    try {
      await StorageService.saveManutencao(manutencao);
      Alert.alert('Sucesso', 'Manutenção registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      Alert.alert('Erro', 'Erro ao salvar manutenção. Tente novamente.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Registrar Manutenção</Text>

          <View style={styles.pickerContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>Tipo de Manutenção *</Text>
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Picker
                selectedValue={tipoManutencao}
                onValueChange={(value) => setTipoManutencao(value as TipoManutencao)}
                style={[styles.picker, { color: theme.colors.text.primary }]}
                itemStyle={{ color: theme.mode === 'dark' ? '#000000' : theme.colors.text.primary }}
              >
                {tiposManutencao.map((tipo) => (
                  <Picker.Item 
                    key={tipo} 
                    label={tipo} 
                    value={tipo} 
                    color={theme.mode === 'dark' ? '#000000' : theme.colors.text.primary}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {tipoManutencao === 'Outro' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>Especifique o Motivo *</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    borderColor: errors.motivoCustomizado ? theme.colors.error : theme.colors.border,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.card,
                  }
                ]}
                value={motivoCustomizado}
                onChangeText={setMotivoCustomizado}
                placeholder="Digite o motivo da manutenção"
                placeholderTextColor={theme.colors.text.secondary}
                multiline
              />
              {errors.motivoCustomizado && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.motivoCustomizado}</Text>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>Data *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: errors.data ? theme.colors.error : theme.colors.border,
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.card,
                }
              ]}
              value={data}
              onChangeText={setData}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.data && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.data}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>Observações</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.card,
                }
              ]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Digite as observações"
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={[styles.botaoSalvar, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSalvar}
          >
            <Text style={[styles.botaoSalvarTexto, { color: theme.colors.text.light }]}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 4,
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoSalvarTexto: {
    fontSize: 16,
    fontWeight: '700',
  },
}); 