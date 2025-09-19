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

type Props = NativeStackScreenProps<FiliaisStackParamList, 'FilialForm'>;

export const FilialFormScreen = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
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
      title: isEditing ? 'Editar Filial' : 'Nova Filial',
    });
  }, [navigation, isEditing]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Nome (obrigatório, 3-100 caracteres)
    if (!nome.trim()) {
      newErrors.nome = '❌ Nome da filial é obrigatório';
    } else if (nome.trim().length < 3) {
      newErrors.nome = '❌ Nome deve ter pelo menos 3 caracteres';
    } else if (nome.trim().length > 100) {
      newErrors.nome = '❌ Nome deve ter no máximo 100 caracteres';
    }

    // Logradouro (obrigatório, 3-100 caracteres)
    if (!endereco.trim()) {
      newErrors.endereco = '❌ Logradouro é obrigatório';
    } else if (endereco.trim().length < 3) {
      newErrors.endereco = '❌ Logradouro deve ter pelo menos 3 caracteres';
    } else if (endereco.trim().length > 100) {
      newErrors.endereco = '❌ Logradouro deve ter no máximo 100 caracteres';
    }

    // Número (obrigatório, máximo 10 caracteres)
    if (!numero.trim()) {
      newErrors.numero = '❌ Número é obrigatório';
    } else if (numero.trim().length > 10) {
      newErrors.numero = '❌ Número deve ter no máximo 10 caracteres';
    }

    // Bairro (obrigatório)
    if (!bairro.trim()) {
      newErrors.bairro = '❌ Bairro é obrigatório';
    }

    // Cidade (obrigatória)
    if (!cidade.trim()) {
      newErrors.cidade = '❌ Cidade é obrigatória';
    }

    // Estado (obrigatório, exatamente 2 caracteres)
    if (!estado.trim()) {
      newErrors.estado = '❌ Estado é obrigatório';
    } else if (estado.trim().length !== 2) {
      newErrors.estado = '❌ Estado deve ter exatamente 2 caracteres (ex: SP)';
    }

    // CEP (obrigatório, exatamente 8 dígitos)
    const cepNumeros = cep.replace(/\D/g, '');
    if (!cep.trim()) {
      newErrors.cep = '❌ CEP é obrigatório';
    } else if (cepNumeros.length !== 8) {
      newErrors.cep = '❌ CEP deve ter exatamente 8 dígitos';
    }

    // Telefone (obrigatório)
    if (!telefone.trim()) {
      newErrors.telefone = '❌ Telefone é obrigatório';
    } else if (telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = '❌ Telefone deve ter pelo menos 10 dígitos';
    }

    // Validações opcionais
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '❌ Email inválido';
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
        Alert.alert('Sucesso', 'Filial atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await FilialService.create(filialData);
        Alert.alert('Sucesso', 'Filial cadastrada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      Alert.alert('Erro', 'Não foi possível salvar a filial. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {isEditing ? 'Editar Filial' : 'Cadastrar Nova Filial'}
        </Text>

        <View style={[styles.helpSection, { backgroundColor: theme.colors.secondaryBackground }]}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            📋 Campos Obrigatórios
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.secondary }]}>
            • Nome (3-100 caracteres){'\n'}
            • Logradouro (3-100 caracteres){'\n'}
            • Número (máximo 10 caracteres){'\n'}
            • Bairro, Cidade, Estado (2 letras){'\n'}
            • CEP (8 dígitos){'\n'}
            • Telefone (mínimo 10 dígitos){'\n'}
            • Email (opcional)
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome da Filial *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome da filial"
            error={errors.nome}
          />

          <Input
            label="Logradouro *"
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua das Flores"
            error={errors.endereco}
          />

          <Input
            label="Número *"
            value={numero}
            onChangeText={setNumero}
            placeholder="123"
            error={errors.numero}
            maxLength={10}
            keyboardType="default"
          />

          <Input
            label="Complemento"
            value={complemento}
            onChangeText={setComplemento}
            placeholder="Apto, Sala, Bloco (opcional)"
            error={errors.complemento}
          />

          <Input
            label="Bairro *"
            value={bairro}
            onChangeText={setBairro}
            placeholder="Digite o bairro"
            error={errors.bairro}
          />

          <View style={styles.row}>
            <View style={styles.flex2}>
              <Input
                label="Cidade *"
                value={cidade}
                onChangeText={setCidade}
                placeholder="Digite a cidade"
                error={errors.cidade}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Estado *"
                value={estado}
                onChangeText={(text) => setEstado(text.toUpperCase())}
                placeholder="SP"
                error={errors.estado}
                maxLength={2}
              />
            </View>
          </View>

          <Input
            label="CEP *"
            value={cep}
            onChangeText={setCep}
            placeholder="12345-678"
            error={errors.cep}
            keyboardType="numeric"
            maxLength={9}
          />

          <Input
            label="Telefone *"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 99999-9999"
            error={errors.telefone}
            keyboardType="phone-pad"
          />

          <Input
            label="Email (Opcional)"
            value={email}
            onChangeText={setEmail}
            placeholder="filial@empresa.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {(nome || endereco || cidade || estado || cep) && (
          <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.previewTitle, { color: theme.colors.text.primary }]}>Preview:</Text>
            <Text style={[styles.previewText, { color: theme.colors.text.secondary }]}>
              {nome && `${nome}\n`}
              {endereco && `${endereco}\n`}
              {(cidade || estado) && `${cidade}${cidade && estado ? ' - ' : ''}${estado}\n`}
              {cep && `CEP: ${cep}\n`}
              {telefone && `Tel: ${telefone}\n`}
              {email && `Email: ${email}`}
            </Text>
          </View>
        )}

        {/* Botão para ver motos da filial (só aparece quando está editando uma filial existente) */}
        {isEditing && filial && (
          <Button
            title="📍 Ver Motos desta Filial"
            onPress={() => navigation.navigate('MotosFilial', { filial })}
            variant="tertiary"
            style={styles.motosButton}
          />
        )}

        <Button
          title={loading ? (isEditing ? "Atualizando..." : "Salvando...") : (isEditing ? "Atualizar Filial" : "Salvar Filial")}
          onPress={handleSalvar}
          variant="primary"
          disabled={loading}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              {isEditing ? 'Atualizando filial...' : 'Cadastrando filial...'}
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
