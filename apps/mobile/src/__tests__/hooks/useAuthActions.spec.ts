import { act, renderHook } from '@testing-library/react-hooks';
import { Alert } from 'react-native';
import * as AuthContext from '../../contexts/AuthContext';
import { useAuthActions } from '../../hooks/auth/useAuthActions';

describe('useAuthActions', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(AuthContext, 'useAuthContext').mockImplementation(() => ({
      login: mockLogin,
      logout: mockLogout,
      user: null,
      token: null,
      isLoading: false,
    }));
  });

  describe('handleLogin', () => {
    test('calls login when handleLogin is invoked with valid credentials', async () => {
      const { result } = renderHook(() => useAuthActions());

      act(() => {
        result.current.setUsername('testuser');
        result.current.setPassword('password123');
      });

      await act(async () => {
        await result.current.handleLogin();
      });
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    test('shows alert if username or password is missing', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        result.current.setUsername('');
        result.current.setPassword('');
        await result.current.handleLogin();
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Error',
        'Username and password are required'
      );
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('handleLogout', () => {
    test('calls logout when logout is confirmed in alert', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.handleLogout();
      });

      const logoutButton = alertSpy.mock.calls[0][2]?.find(
        (btn) => btn.text === 'Logout'
      );

      expect(logoutButton).toBeDefined();

      act(() => {
        logoutButton?.onPress?.();
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('does not call logout when cancel is pressed', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.handleLogout();
      });

      const cancelButton = alertSpy.mock.calls[0][2]?.find(
        (btn) => btn.text === 'Cancel'
      );

      expect(cancelButton).toBeDefined();

      act(() => {
        cancelButton?.onPress?.();
      });

      expect(mockLogout).not.toHaveBeenCalled();
    });
  });
});
