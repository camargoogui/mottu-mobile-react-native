import { Platform } from 'react-native';

// Função para detectar automaticamente o IP local
const getLocalIP = (): string => {
  // Para desenvolvimento, você pode usar estas opções:
  
  // 1. Para emulador Android (Genymotion/AVD)
  if (Platform.OS === 'android' && __DEV__) {
    return '10.0.2.2'; // IP padrão do emulador Android para acessar localhost do host
  }
  
  // 2. Para iOS Simulator
  if (Platform.OS === 'ios' && __DEV__) {
    return 'localhost'; // iOS Simulator acessa localhost diretamente
  }
  
  // 3. Para dispositivos físicos, você precisa usar o IP real da sua máquina
  // Este IP deve ser atualizado manualmente ou via script
  return '192.168.68.106'; // Substitua pelo seu IP atual
};

// Configuração da API
export const API_CONFIG = {
  // IP base - será detectado automaticamente
  BASE_IP: getLocalIP(),
  
  // Porta da API .NET
  PORT: 5001,
  
  // URL completa da API
  get BASE_URL() {
    return `http://${this.BASE_IP}:${this.PORT}/api`;
  },
  
  // Timeout para requisições
  TIMEOUT: 10000,
  
  // API Key para autenticação
  // IMPORTANTE: Configure sua API Key aqui ou via variável de ambiente
  API_KEY: process.env.EXPO_PUBLIC_API_KEY || 'local-dev-key',
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Função para atualizar o IP manualmente (útil para desenvolvimento)
export const updateAPIBaseIP = (newIP: string) => {
  API_CONFIG.BASE_IP = newIP;
  console.log(`🔄 API Base IP atualizado para: ${newIP}`);
  console.log(`🌐 Nova URL da API: ${API_CONFIG.BASE_URL}`);
};

// Função para obter informações da API atual
export const getAPIInfo = () => {
  return {
    baseIP: API_CONFIG.BASE_IP,
    port: API_CONFIG.PORT,
    baseURL: API_CONFIG.BASE_URL,
    platform: Platform.OS,
    isDev: __DEV__,
  };
};
