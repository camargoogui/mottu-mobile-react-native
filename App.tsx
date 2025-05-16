import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigation } from './src/navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StorageService } from './src/services/storage';
import { colors } from './src/theme';

// Mantém o splash screen visível enquanto inicializamos
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignora o erro se o splash screen já estiver escondido
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Iniciando preparação do app...');
        
        // Inicializa dados mockados
        await StorageService.initializeMockData();
        console.log('Dados mockados inicializados com sucesso');
        
        setAppIsReady(true);
      } catch (e) {
        console.error('Erro durante a inicialização:', e);
        setError(e instanceof Error ? e.message : 'Erro desconhecido');
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Erro ao esconder splash screen:', e);
      }
    }
  }, [appIsReady]);

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao iniciar o app:</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!appIsReady) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.appContainer} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
