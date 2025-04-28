import { faker } from '@faker-js/faker';
import axios from 'axios';
import { login } from '../../api/auth';
import { generateUser } from '../generateData';

jest.mock('axios');

describe('login API function', () => {
  const mockCredentials = {
    username: faker.internet.displayName(),
    password: faker.internet.password(),
  };

  const mockResponse = {
    data: {
      access_token: 'mockAccessToken',
      user: generateUser(),
    },
  };

  const mockErrorResponse = {
    response: {
      status: 401,
      data: { message: 'Invalid credentials' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should login successfully and return the response', async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const response = await login(mockCredentials);

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.API_AUTH_BASE_URL}/auth/login`,
      mockCredentials
    );
    expect(response).toEqual(mockResponse);
  });

  test('should throw an error when login fails with 401', async () => {
    (axios.post as jest.Mock).mockRejectedValue(mockErrorResponse);

    try {
      await login(mockCredentials);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Invalid credentials');
    }
  });

  test('should handle unexpected errors gracefully', async () => {
    const mockNetworkError = new Error('Network Error');
    (axios.post as jest.Mock).mockRejectedValue(mockNetworkError);

    try {
      await login(mockCredentials);
    } catch (error) {
      expect(error.message).toBe('Network Error');
    }
  });
});
