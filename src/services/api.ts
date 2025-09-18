import axios from 'axios';

// Configure o baseURL com o IP local da sua máquina e porta da API .NET
// Exemplo: http://192.168.1.100:5000/api ou http://localhost:5000/api
const baseURL = 'http://192.168.1.100:5000/api'; // Altere para o seu IP local

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

