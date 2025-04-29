import { faker } from '@faker-js/faker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, waitFor } from '@testing-library/react-native';
import { AxiosHeaders, AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import * as AuthApi from '../../api/auth';
import { AuthProvider, useAuthContext } from '../../contexts/AuthContext';
import { generateUser } from '../generateData';

describe('AuthContext', () => {
  const token = faker.internet.jwt();
  const mockUser = generateUser();

  const mockAxiosResponse: AxiosResponse = {
    data: {
      access_token: token,
      user: mockUser,
    },
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = ({ onReady }: { onReady: (context: any) => void }) => {
    const context = useAuthContext();
    useEffect(() => {
      onReady(context);
    }, [context]);

    return null;
  };

  test('loads stored token and user on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve(token);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return null;
    });

    let context: any;
    render(
      <AuthProvider>
        <TestComponent onReady={(ctx) => (context = ctx)} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(context.user?.username).toBe(mockUser.username);
      expect(context.token).toBe(token);
      expect(context.isLoading).toBe(false);
    });
  });

  test('login sets user and token and stores them', async () => {
    jest.spyOn(AuthApi, 'login').mockResolvedValue(mockAxiosResponse);

    let context: any;
    render(
      <AuthProvider>
        <TestComponent onReady={(ctx) => (context = ctx)} />
      </AuthProvider>
    );

    await waitFor(() => expect(context.isLoading).toBe(false));

    await act(async () => {
      await context.login(mockUser.username, 'password123');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', token);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser)
    );
    expect(context.user?.username).toBe(mockUser.username);
    expect(context.token).toBe(token);
  });

  test('logout clears user and token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve(token);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return null;
    });

    let context: any;
    render(
      <AuthProvider>
        <TestComponent onReady={(ctx) => (context = ctx)} />
      </AuthProvider>
    );

    await waitFor(() => expect(context.user?.username).toBe(mockUser.username));

    await act(async () => await context.logout());

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(context.user).toBe(null);
    expect(context.token).toBe(null);
  });
});
