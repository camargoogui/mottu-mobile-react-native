import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const filiais = [
  'São Paulo - Centro',
  'São Paulo - Zona Sul',
  'São Paulo - Zona Norte',
  'São Paulo - Zona Leste',
  'São Paulo - Zona Oeste',
];

export const Configuracoes = () => {
  const [filialSelecionada, setFilialSelecionada] = useState<string>('');

  useEffect(() => {
    carregarFilial();
  }, []);

  const carregarFilial = async () => {
    try {
      const filial = await AsyncStorage.getItem('filial');
      if (filial) {
        setFilialSelecionada(filial);
      }
    } catch (error) {
      console.error('Erro ao carregar filial:', error);
    }
  };

  const salvarFilial = async (filial: string) => {
    try {
      await AsyncStorage.setItem('filial', filial);
      setFilialSelecionada(filial);
      Alert.alert('Sucesso', 'Filial atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      Alert.alert('Erro', 'Não foi possível salvar a filial');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>
      <Text style={styles.subtitulo}>Selecione sua filial:</Text>

      <View style={styles.listaFiliais}>
        {filiais.map((filial) => (
          <TouchableOpacity
            key={filial}
            style={[
              styles.filialItem,
              filialSelecionada === filial && styles.filialItemSelecionado,
            ]}
            onPress={() => salvarFilial(filial)}
          >
            <Text
              style={[
                styles.filialTexto,
                filialSelecionada === filial && styles.filialTextoSelecionado,
              ]}
            >
              {filial}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 16,
  },
  listaFiliais: {
    flex: 1,
  },
  filialItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  filialItemSelecionado: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filialTexto: {
    fontSize: 16,
    color: '#333',
  },
  filialTextoSelecionado: {
    color: '#fff',
  },
}); 