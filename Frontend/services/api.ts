import axios from 'axios';
import { AppError } from '@/utils/AppError';

const api = axios.create({
  baseURL: 'http://192.168.3.4:3000', 
});


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
