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
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../services/notifications';

type Props = NativeStackScreenProps<MotosStackParamList, 'CadastroMoto'>;

export const CadastroMoto = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
      newErrors.placa = `❌ ${t('moto.plateRequired')}`;
    } else if (placa.trim().length !== 7) {
      newErrors.placa = `❌ ${t('moto.plateLength')}`;
    }

    // Modelo (obrigatório, 2-50 caracteres)
    if (!modelo.trim()) {
      newErrors.modelo = `❌ ${t('moto.modelRequired')}`;
    } else if (modelo.trim().length < 2) {
      newErrors.modelo = `❌ ${t('moto.modelMin')}`;
    } else if (modelo.trim().length > 50) {
      newErrors.modelo = `❌ ${t('moto.modelMax')}`;
    }

    // Ano (obrigatório, 1900-2030)
    const anoNum = parseInt(ano);
    if (!ano.trim()) {
      newErrors.ano = `❌ ${t('moto.yearRequired')}`;
    } else if (isNaN(anoNum) || anoNum < 1900 || anoNum > 2030) {
      newErrors.ano = `❌ ${t('moto.yearRange')}`;
    }

    // Cor (obrigatória, 3-30 caracteres)
    if (!cor.trim()) {
      newErrors.cor = `❌ ${t('moto.colorRequired')}`;
    } else if (cor.trim().length < 3) {
      newErrors.cor = `❌ ${t('moto.colorMin')}`;
    } else if (cor.trim().length > 30) {
      newErrors.cor = `❌ ${t('moto.colorMax')}`;
    }

    // Filial ID (obrigatório, maior que 0)
    const filialNum = parseInt(filialId);
    if (!filialId.trim()) {
      newErrors.filialId = `❌ ${t('moto.branchRequired')}`;
    } else if (isNaN(filialNum) || filialNum <= 0) {
      newErrors.filialId = `❌ ${t('moto.branchRequired')}`;
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
        
        // Verifica e solicita permissões antes de enviar notificação
        try {
          const permissionStatus = await notificationService.getPermissionStatus();
          console.log('🔔 Status de permissão:', permissionStatus);
          
          if (permissionStatus !== 'granted') {
            console.log('📱 Solicitando permissões de notificação...');
            const newStatus = await notificationService.requestPermissions();
            console.log('📱 Novo status de permissão:', newStatus);
          }
          
          // Envia notificação de sucesso (mesmo se permissão não foi concedida, tenta enviar)
          const notificationId = await notificationService.sendTestNotification(
            `🏍️ ${t('moto.newMotoNotification')}`,
            `${modelo} - ${t('moto.plate')}: ${placa.trim().toUpperCase()} ${t('moto.createdSuccess')}`,
            { screen: 'ListaMotos' },
            2 // 2 segundos de delay
          );
          
          if (notificationId) {
            console.log('✅ Notificação agendada com sucesso:', notificationId);
          } else {
            console.warn('⚠️ Não foi possível agendar a notificação');
          }
        } catch (notificationError) {
          console.error('❌ Erro ao enviar notificação:', notificationError);
          // Não bloqueia o fluxo se a notificação falhar
        }
        
        Alert.alert(t('common.success'), t('moto.createdSuccess'), [
          { text: t('common.ok'), onPress: () => navigation.goBack() }
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
          t('common.error'), 
          t('errors.connectionError'),
          [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Erro ao salvar moto:', error);
      Alert.alert(t('common.error'), t('errors.tryAgain'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{t('moto.create')}</Text>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 {t('common.empty')}
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            • {t('moto.plate')} (exatamente 7 caracteres){'\n'}
            • {t('moto.model')} (2-50 caracteres){'\n'}
            • {t('moto.year')} (1900-2030){'\n'}
            • {t('moto.color')} (3-30 caracteres){'\n'}
            • {t('moto.branch')} (ID válido)
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={`${t('moto.plate')} *`}
            value={placa}
            onChangeText={(text) => setPlaca(text.toUpperCase())}
            placeholder="ABC1234"
            error={errors.placa}
            maxLength={7}
          />

          <Input
            label={`${t('moto.model')} *`}
            value={modelo}
            onChangeText={setModelo}
            placeholder="Honda CG 160, Yamaha XJ6, etc."
            error={errors.modelo}
            maxLength={50}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label={`${t('moto.year')} *`}
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
                label={`${t('moto.color')} *`}
                value={cor}
                onChangeText={setCor}
                placeholder={t('moto.colorPlaceholder')}
                error={errors.cor}
                maxLength={30}
              />
            </View>
          </View>

          <Input
            label={`ID ${t('moto.branch')} *`}
            value={filialId}
            onChangeText={setFilialId}
            placeholder="3, 4, 5, etc."
            error={errors.filialId}
            keyboardType="numeric"
            helperText={`💡 ${t('common.noData')}`}
          />
        </View>

        {(modelo || placa || ano || cor || filialId) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>{t('common.empty')}:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              {placa && `🏍️ ${t('moto.plate')}: ${placa}\n`}
              {modelo && `📋 ${t('moto.model')}: ${modelo}\n`}
              {ano && `📅 ${t('moto.year')}: ${ano}\n`}
              {cor && `🎨 ${t('moto.color')}: ${cor}\n`}
              {filialId && `📍 ${t('moto.branch')} ID: ${filialId}`}
            </Text>
          </View>
        )}

          <Button
            title={loading ? t('common.loading') : t('common.save')}
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