import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FiliaisStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { FilialService } from '../services/filialService';
import { Filial } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type Props = NativeStackScreenProps<FiliaisStackParamList, 'FilialForm'>;

export const FilialFormScreen = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { filial } = route.params || {};
  const isEditing = !!filial;

  const [nome, setNome] = useState(filial?.nome || '');
  const [endereco, setEndereco] = useState(filial?.logradouro || filial?.endereco?.split(',')[0]?.trim() || '');
  const [numero, setNumero] = useState(filial?.numero || filial?.endereco?.split(',')[1]?.trim() || '');
  const [complemento, setComplemento] = useState(filial?.complemento || '');
  const [bairro, setBairro] = useState(filial?.bairro || 'Centro'); // Campo obrigatório da API
  const [cidade, setCidade] = useState(filial?.cidade || '');
  const [estado, setEstado] = useState(filial?.estado || '');
  const [cep, setCep] = useState(filial?.cep || '');
  const [telefone, setTelefone] = useState(filial?.telefone || '');
  const [email, setEmail] = useState(filial?.email || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('filial.edit') : t('filial.newBranch'),
    });
  }, [navigation, isEditing]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Nome (obrigatório, 3-100 caracteres)
    if (!nome.trim()) {
      newErrors.nome = `❌ ${t('filial.nameRequired')}`;
    } else if (nome.trim().length < 3) {
      newErrors.nome = `❌ ${t('filial.nameMin')}`;
    } else if (nome.trim().length > 100) {
      newErrors.nome = `❌ ${t('filial.nameMax')}`;
    }

    // Logradouro (obrigatório, 3-100 caracteres)
    if (!endereco.trim()) {
      newErrors.endereco = `❌ ${t('filial.streetRequired')}`;
    } else if (endereco.trim().length < 3) {
      newErrors.endereco = `❌ ${t('filial.streetMin')}`;
    } else if (endereco.trim().length > 100) {
      newErrors.endereco = `❌ ${t('filial.streetMax')}`;
    }

    // Número (obrigatório, máximo 10 caracteres)
    if (!numero.trim()) {
      newErrors.numero = `❌ ${t('filial.numberRequired')}`;
    } else if (numero.trim().length > 10) {
      newErrors.numero = `❌ ${t('filial.numberMax')}`;
    }

    // Bairro (obrigatório)
    if (!bairro.trim()) {
      newErrors.bairro = `❌ ${t('filial.neighborhoodRequired')}`;
    }

    // Cidade (obrigatória)
    if (!cidade.trim()) {
      newErrors.cidade = `❌ ${t('filial.cityRequired')}`;
    }

    // Estado (obrigatório, exatamente 2 caracteres)
    if (!estado.trim()) {
      newErrors.estado = `❌ ${t('filial.stateRequired')}`;
    } else if (estado.trim().length !== 2) {
      newErrors.estado = `❌ ${t('filial.stateLength')}`;
    }

    // CEP (obrigatório, exatamente 8 dígitos)
    const cepNumeros = cep.replace(/\D/g, '');
    if (!cep.trim()) {
      newErrors.cep = `❌ ${t('filial.zipCodeRequired')}`;
    } else if (cepNumeros.length !== 8) {
      newErrors.cep = `❌ ${t('filial.zipCodeLength')}`;
    }

    // Telefone (obrigatório)
    if (!telefone.trim()) {
      newErrors.telefone = `❌ ${t('filial.phoneRequired')}`;
    } else if (telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = `❌ ${t('filial.phoneMin')}`;
    }

    // Validações opcionais
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = `❌ ${t('auth.emailInvalid')}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const filialData = {
        nome: nome.trim(),
        logradouro: endereco.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || 'N/A', // Oracle não aceita string vazia
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        cep: cep.replace(/\D/g, ''), // Remover formatação para enviar só números
        telefone: telefone.trim(), // Obrigatório - não pode ser undefined
        email: email.trim() || undefined, // Opcional
      };

      if (isEditing && filial) {
        const updateData = {
          ...filialData,
          id: filial.id,
          ativa: filial.ativa,
        };
        await FilialService.update(filial.id, updateData);
        Alert.alert(t('common.success'), t('filial.updatedSuccess'), [
          { text: t('common.ok'), onPress: () => navigation.goBack() }
        ]);
      } else {
        await FilialService.create(filialData);
        Alert.alert(t('common.success'), t('filial.createdSuccess'), [
          { text: t('common.ok'), onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      Alert.alert(t('common.error'), t('errors.tryAgain'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {isEditing ? t('filial.edit') : t('filial.create')}
        </Text>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 {t('filial.requiredFieldsTitle')}
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            {t('filial.requiredFields')}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label={`${t('filial.name')} *`}
            value={nome}
            onChangeText={setNome}
            placeholder={t('filial.namePlaceholder')}
            error={errors.nome}
          />

          <Input
            label={`${t('filial.street')} *`}
            value={endereco}
            onChangeText={setEndereco}
            placeholder={t('filial.streetPlaceholder')}
            error={errors.endereco}
          />

          <Input
            label={`${t('filial.number')} *`}
            value={numero}
            onChangeText={setNumero}
            placeholder={t('filial.numberPlaceholder')}
            error={errors.numero}
            maxLength={10}
            keyboardType="default"
          />

          <Input
            label={t('filial.complement')}
            value={complemento}
            onChangeText={setComplemento}
            placeholder={t('filial.complementPlaceholder')}
            error={errors.complemento}
          />

          <Input
            label={`${t('filial.neighborhood')} *`}
            value={bairro}
            onChangeText={setBairro}
            placeholder={t('filial.neighborhoodPlaceholder')}
            error={errors.bairro}
          />

          <View style={styles.row}>
            <View style={styles.flex2}>
              <Input
                label={`${t('filial.city')} *`}
                value={cidade}
                onChangeText={setCidade}
                placeholder={t('filial.cityPlaceholder')}
                error={errors.cidade}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label={`${t('filial.state')} *`}
                value={estado}
                onChangeText={(text) => setEstado(text.toUpperCase())}
                placeholder={t('filial.statePlaceholder')}
                error={errors.estado}
                maxLength={2}
              />
            </View>
          </View>

          <Input
            label={`${t('filial.zipCode')} *`}
            value={cep}
            onChangeText={setCep}
            placeholder={t('filial.zipCodePlaceholder')}
            error={errors.cep}
            keyboardType="numeric"
            maxLength={9}
          />

          <Input
            label={`${t('filial.phone')} *`}
            value={telefone}
            onChangeText={setTelefone}
            placeholder={t('filial.phonePlaceholder')}
            error={errors.telefone}
            keyboardType="phone-pad"
          />

          <Input
            label={`${t('filial.email')} (${t('common.empty')})`}
            value={email}
            onChangeText={setEmail}
            placeholder={t('filial.emailPlaceholder')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {(nome || endereco || cidade || estado || cep) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>{t('filial.previewTitle')}</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              {nome && `${nome}\n`}
              {endereco && `${endereco}\n`}
              {(cidade || estado) && `${cidade}${cidade && estado ? ' - ' : ''}${estado}\n`}
              {cep && `${t('filial.zipCode')}: ${cep}\n`}
              {telefone && `${t('filial.telLabel')}: ${telefone}\n`}
              {email && `${t('filial.emailLabel')}: ${email}`}
            </Text>
          </View>
        )}

        {/* Botão para ver motos da filial (só aparece quando está editando uma filial existente) */}
        {isEditing && filial && (
          <Button
            title={t('filial.viewBranchMotorcycles')}
            onPress={() => navigation.navigate('MotosFilial', { filial })}
            variant="tertiary"
            style={styles.motosButton}
          />
        )}

        <Button
          title={loading ? (isEditing ? t('filial.updating') : t('filial.saving')) : (isEditing ? t('filial.updateBranch') : t('filial.saveBranch'))}
          onPress={handleSalvar}
          variant="primary"
          disabled={loading}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              {isEditing ? t('filial.updatingBranch') : t('filial.creatingBranch')}
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
  form: {
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
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
  motosButton: {
    marginBottom: 12,
  },
});
