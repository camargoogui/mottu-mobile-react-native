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
import { useLanguage } from '../contexts/LanguageContext';
import { StorageService } from '../services/storage';

type Props = NativeStackScreenProps<MotosStackParamList, 'FormularioManutencao'>;

// Mapeia tipos de manutenção para chaves de tradução
const getMaintenanceTypes = (t: (key: string) => string): TipoManutencao[] => [
  t('maintenance.oilChange') as TipoManutencao,
  t('maintenance.brakes') as TipoManutencao,
  t('maintenance.tires') as TipoManutencao,
  t('maintenance.chain') as TipoManutencao,
  t('maintenance.electrical') as TipoManutencao,
  t('maintenance.suspension') as TipoManutencao,
  t('maintenance.engine') as TipoManutencao,
  t('maintenance.clutch') as TipoManutencao,
  t('maintenance.battery') as TipoManutencao,
  t('maintenance.carburetor') as TipoManutencao,
  t('maintenance.other') as TipoManutencao,
];

// Tipos originais para compatibilidade
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
  const { t } = useLanguage();
  const { motoId } = route.params;
  // Inicializa com o primeiro tipo traduzido
  const [tipoManutencao, setTipoManutencao] = useState<TipoManutencao>(() => getMaintenanceTypes(t)[0]);
  const [motivoCustomizado, setMotivoCustomizado] = useState('');
  const [data, setData] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const otherTypes = [t('maintenance.other')];
    if (otherTypes.includes(tipoManutencao) && !motivoCustomizado.trim()) {
      newErrors.motivoCustomizado = t('maintenance.specifyReason');
    }
    if (!data.trim()) {
      newErrors.data = t('maintenance.dateRequired');
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      newErrors.data = t('maintenance.dateInvalid');
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
      motivoCustomizado: tipoManutencao === t('maintenance.other') ? motivoCustomizado : undefined,
      data,
      observacoes,
    };

    try {
      await StorageService.saveManutencao(manutencao);
      Alert.alert(t('common.success'), t('maintenance.createdSuccess'));
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      Alert.alert(t('common.error'), t('maintenance.saveError'));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>{t('maintenance.create')}</Text>

          <View style={styles.pickerContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('maintenance.type')} *</Text>
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Picker
                selectedValue={tipoManutencao}
                onValueChange={(value) => setTipoManutencao(value as TipoManutencao)}
                style={[styles.picker, { color: theme.colors.text.primary }]}
                itemStyle={{ color: theme.mode === 'dark' ? '#000000' : theme.colors.text.primary }}
              >
                {getMaintenanceTypes(t).map((tipo) => (
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

          {tipoManutencao === t('maintenance.other') && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('maintenance.specifyReasonLabel')}</Text>
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
                placeholder={t('maintenance.specifyReasonPlaceholder')}
                placeholderTextColor={theme.colors.text.secondary}
                multiline
              />
              {errors.motivoCustomizado && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.motivoCustomizado}</Text>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('maintenance.date')} *</Text>
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
              placeholder={t('maintenance.datePlaceholder')}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.data && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.data}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('maintenance.observationsLabel')}</Text>
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
              placeholder={t('maintenance.observationsPlaceholder')}
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={[styles.botaoSalvar, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSalvar}
          >
            <Text style={[styles.botaoSalvarTexto, { color: theme.colors.text.light }]}>{t('common.save')}</Text>
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