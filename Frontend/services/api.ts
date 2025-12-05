import axios from 'axios';
import { AppError } from '@/utils/AppError';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://inartificially-unlaminated-marin.ngrok-free.dev', // ngrok tunnel for production testing
});


api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error?.response?.data?.message || 
      error?.message ||               
      'Erro inesperado';

    return Promise.reject(new AppError(message));
  }
);

export default api;
