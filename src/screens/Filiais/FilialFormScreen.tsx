import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FiliaisStackParamList } from '../../navigation';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { FilialService } from '../../services/filialService';
import { Filial } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

type Props = NativeStackScreenProps<FiliaisStackParamList, 'FilialForm'>;

export const FilialFormScreen = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { filial } = route.params || {};
  const isEditing = !!filial;

  const [nome, setNome] = useState(filial?.nome || '');
  const [endereco, setEndereco] = useState(filial?.endereco || '');
  const [cidade, setCidade] = useState(filial?.cidade || '');
  const [estado, setEstado] = useState(filial?.estado || '');
  const [cep, setCep] = useState(filial?.cep || '');
  const [telefone, setTelefone] = useState(filial?.telefone || '');
  const [email, setEmail] = useState(filial?.email || '');
  const [latitude, setLatitude] = useState(filial?.coordenadas?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(filial?.coordenadas?.longitude?.toString() || '');
  const [altitude, setAltitude] = useState(filial?.coordenadas?.altitude?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Filial' : 'Nova Filial',
    });
  }, [navigation, isEditing]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome da filial é obrigatório';
    }
    if (!endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }
    if (!cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    } else if (estado.length !== 2) {
      newErrors.estado = 'Estado deve ter 2 caracteres (ex: SP)';
    }
    if (!cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(cep)) {
      newErrors.cep = 'CEP inválido (formato: 12345-678)';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (latitude && isNaN(Number(latitude))) {
      newErrors.latitude = 'Latitude deve ser um número';
    }
    if (longitude && isNaN(Number(longitude))) {
      newErrors.longitude = 'Longitude deve ser um número';
    }
    if (altitude && isNaN(Number(altitude))) {
      newErrors.altitude = 'Altitude deve ser um número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const filialData = {
        nome,
        endereco,
        cidade,
        estado: estado.toUpperCase(),
        cep: cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'), // Formatar CEP
        telefone: telefone || undefined,
        email: email || undefined,
        coordenadas: (latitude && longitude) ? {
          latitude: Number(latitude),
          longitude: Number(longitude),
          altitude: altitude ? Number(altitude) : undefined,
        } : undefined,
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

        <View style={styles.form}>
          <Input
            label="Nome da Filial *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome da filial"
            error={errors.nome}
          />

          <Input
            label="Endereço *"
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Digite o endereço completo"
            error={errors.endereco}
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
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 99999-9999"
            error={errors.telefone}
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="filial@empresa.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Coordenadas (Opcional)
          </Text>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                placeholder="-23.5505"
                error={errors.latitude}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                placeholder="-46.6333"
                error={errors.longitude}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Input
            label="Altitude"
            value={altitude}
            onChangeText={setAltitude}
            placeholder="760"
            error={errors.altitude}
            keyboardType="numeric"
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
    marginBottom: 24,
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
});
