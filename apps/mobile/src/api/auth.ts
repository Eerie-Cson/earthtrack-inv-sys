import { API_AUTH_BASE_URL } from '@env';
import axios from 'axios';
import { LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials) => {
  return axios.post(`${API_AUTH_BASE_URL}/auth/login`, credentials);
};
