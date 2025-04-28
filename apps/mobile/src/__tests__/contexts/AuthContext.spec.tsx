import { faker } from '@faker-js/faker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import { AxiosHeaders, AxiosResponse } from 'axios';
import * as AuthApi from '../../api/auth';
import { AuthProvider, useAuthContext } from '../../contexts/AuthContext';

describe('AuthContext', () => {
  const token = faker.internet.jwt();

  const mockUser = {
    id: 'acc_01c3a51ab784c620d6decec2acf06979',
    username: faker.internet.displayName(),
    role: 'admin',
    email: faker.internet.email(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
  };

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

  test('loads stored token and user on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve(token);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return null;
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    expect(result.current.user?.username).toBe(mockUser.username);
    expect(result.current.token).toBe(token);
    expect(result.current.isLoading).toBe(false);
  });

  test('login sets user and token and stores them', async () => {
    jest.spyOn(AuthApi, 'login').mockResolvedValue(mockAxiosResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    await act(async () => {
      await result.current.login(mockUser.username, 'password123');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', token);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser)
    );
    expect(result.current.user?.username).toBe(mockUser.username);
    expect(result.current.token).toBe(token);
  });

  test('logout clears user and token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve(token);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return null;
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    await act(async () => {
      await result.current.logout();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });
});
