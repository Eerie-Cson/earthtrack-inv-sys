import { API_AUTH_BASE_URL, API_PRODUCT_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiAuthClient = axios.create({
  baseURL: API_AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiProductClient = axios.create({
  baseURL: API_PRODUCT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiProductClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiProductClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export { apiAuthClient, apiProductClient };
