import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotosStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { MotoService } from '../services/motoService';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../services/notifications';

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
  const { t } = useLanguage();
  const { moto } = route.params;
  
  // Verificação de segurança: se moto não existe, volta para a tela anterior
  useEffect(() => {
    if (!moto) {
      Alert.alert(t('common.error'), t('moto.notFound'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() }
      ]);
    }
  }, [moto, navigation, t]);
  
  // Validação defensiva para evitar erros quando valores são undefined
  const [modelo, setModelo] = useState(moto?.modelo || '');
  const [placa, setPlaca] = useState(moto?.placa || '');
  const [ano, setAno] = useState(moto?.ano ? moto.ano.toString() : '');
  const [cor, setCor] = useState(moto?.cor || '');
  const [filialId, setFilialId] = useState(moto?.filialId ? moto.filialId.toString() : '');
  const [status, setStatus] = useState(moto?.status || 'disponível');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Se moto não existe, não renderiza o formulário
  if (!moto) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text.primary }}>{t('moto.notFound')}</Text>
      </View>
    );
  }

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

  const handleAtualizar = async () => {
    if (!validate()) return;

    // Verificação de segurança
    if (!moto?.id) {
      Alert.alert(t('common.error'), t('moto.updateError'));
      return;
    }

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

      console.log('🔍 Placa original:', moto?.placa || '');
      console.log('🔍 Placa nova:', placa.trim().toUpperCase());
      console.log('🔍 Placa mudou?', moto?.placa !== placa.trim().toUpperCase());
      console.log('🔄 Status enviado para API:', `${status} -> ${statusToApiNumber(status)}`);

      await MotoService.update(moto.id, motoAtualizada);
      
      // Envia notificação de atualização
      try {
        const permissionStatus = await notificationService.getPermissionStatus();
        console.log('🔔 Status de permissão (atualização):', permissionStatus);
        
        if (permissionStatus !== 'granted') {
          console.log('📱 Solicitando permissões de notificação...');
          await notificationService.requestPermissions();
        }
        
        // Envia notificação de atualização
        const notificationId = await notificationService.sendTestNotification(
          `✏️ ${t('moto.motoUpdatedNotification')}`,
          `${modelo} - ${t('moto.plate')}: ${placa.trim().toUpperCase()} ${t('moto.updatedSuccess')}`,
          { screen: 'ListaMotos' },
          2 // 2 segundos de delay
        );
        
        if (notificationId) {
          console.log('✅ Notificação de atualização agendada:', notificationId);
        } else {
          console.warn('⚠️ Não foi possível agendar a notificação de atualização');
        }
      } catch (notificationError) {
        console.error('❌ Erro ao enviar notificação de atualização:', notificationError);
        // Não bloqueia o fluxo se a notificação falhar
      }
      
      Alert.alert(t('common.success'), t('moto.updatedSuccess'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      Alert.alert(t('common.error'), t('moto.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const StatusPicker = () => (
    <View style={styles.statusContainer}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('moto.statusLabel')} *</Text>
      <View style={styles.statusButtons}>
        {(['disponível', 'ocupada', 'manutenção'] as const).map((statusOption) => (
          <Button
            key={statusOption}
            title={t(`moto.${statusOption === 'disponível' ? 'available' : statusOption === 'ocupada' ? 'occupied' : 'maintenance'}`)}
            onPress={() => setStatus(statusOption)}
            variant={status === statusOption ? 'primary' : 'secondary'}
            style={styles.statusButton}
            fullWidth={false}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{t('moto.edit')}</Text>

        <View style={[styles.currentMoto, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.currentTitle, { color: theme.colors.text.primary }]}>
            📝 {t('moto.edit')}: {moto?.placa || ''}
          </Text>
          <Text style={[styles.currentText, { color: theme.colors.text.secondary }]}>
            {moto?.modelo || ''} {moto?.ano || ''} - {moto?.cor || ''}
          </Text>
        </View>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 {t('common.empty')}
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            • {t('moto.plate')} (exatamente 7 caracteres){'\n'}
            • {t('moto.model')} (2-50 caracteres){'\n'}
            • {t('moto.year')} (1900-2030){'\n'}
            • {t('moto.color')} (3-30 caracteres){'\n'}
            • {t('moto.branch')} (ID válido){'\n'}
            • {t('moto.statusLabel')} ({t('moto.available')}/{t('moto.occupied')}/{t('moto.maintenance')})
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

          <StatusPicker />
        </View>

        {(modelo || placa || ano || cor || filialId) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>{t('common.empty')}:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              🏍️ {t('moto.plate')}: {placa}{'\n'}
              📋 {t('moto.model')}: {modelo}{'\n'}
              📅 {t('moto.year')}: {ano}{'\n'}
              🎨 {t('moto.color')}: {cor}{'\n'}
              📍 {t('moto.branch')} ID: {filialId}{'\n'}
              🔄 {t('moto.statusLabel')}: {t(`moto.${status === 'disponível' ? 'available' : status === 'ocupada' ? 'occupied' : 'maintenance'}`)}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? t('moto.saving') : t('moto.update')}
            onPress={handleAtualizar}
            variant="primary"
            disabled={loading}
            style={styles.updateButton}
            fullWidth={false}
          />
          
          <Button
            title={t('common.cancel')}
            onPress={() => navigation.goBack()}
            variant="secondary"
            disabled={loading}
            style={styles.cancelButton}
            fullWidth={false}
          />
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              {t('moto.updating')}
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
    gap: 6,
    width: '100%',
  },
  statusButton: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    paddingHorizontal: 18,
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
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  updateButton: {
    marginBottom: 8,
    maxWidth: 300,
    width: '100%',
  },
  cancelButton: {
    maxWidth: 300,
    width: '100%',
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
