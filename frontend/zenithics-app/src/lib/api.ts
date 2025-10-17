// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Use the environment variable
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We define this but it's not used in this version of the store yet for simplicity
export const clearAuthHeader = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;