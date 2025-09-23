import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Configuração automática da API baseada na plataforma
// IMPORTANTE: 
// - Para emulador Android: usa 10.0.2.2 automaticamente
// - Para iOS Simulator: usa localhost automaticamente  
// - Para dispositivo físico: usa IP configurado em src/config/api.ts
// - Para que funcione, a API deve rodar com: dotnet run --urls "http://0.0.0.0:5001"

const baseURL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para logging de requisições (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de respostas (desenvolvimento)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    if (response.data) {
      console.log('📥 Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

