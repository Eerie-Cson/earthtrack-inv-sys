import { apiAuthClient } from './axios-config';

export type LoginCredentials = {
  username: string;
  password: string;
};

export const login = (credentials: LoginCredentials) => {
  return apiAuthClient.post('/auth/login', credentials);
};
