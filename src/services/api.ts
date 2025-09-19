import axios from 'axios';

// Configure o baseURL com o IP local da sua máquina e porta da API .NET
// IMPORTANTE: 
// - localhost:5001 funciona apenas no emulador Android
// - Para dispositivo físico ou iOS, use seu IP local
// - Para que o IP local funcione, a API deve rodar com: dotnet run --urls "http://0.0.0.0:5001"

// Descomente a linha apropriada:
// const baseURL = 'http://localhost:5001/api'; // Para emulador Android
const baseURL = 'http://172.16.72.204:5001/api'; // Para dispositivo físico/iOS

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

