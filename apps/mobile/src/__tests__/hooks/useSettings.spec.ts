import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as SettingsContext from '../../contexts/SettingsContext';
import { useSettings } from '../../hooks/settings/useSettings';

describe('useSettings', () => {
  const mockSetRecordsPerPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(SettingsContext, 'useSettingsContext').mockReturnValue({
      recordsPerPage: 10,
      isLoading: false,
      setRecordsPerPage: mockSetRecordsPerPage,
    });
  });

  describe('validateInput', () => {
    test('returns false and sets error for empty input', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        const isValid = result.current.validateInput('');
        expect(isValid).toBe(false);
      });

      expect(result.current.error).toBe('Records per page cannot be empty');
    });

    test('returns false and sets error for non-numeric input', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        const isValid = result.current.validateInput('abc');
        expect(isValid).toBe(false);
      });

      expect(result.current.error).toBe('Please enter a valid number');
    });

    test('returns false for zero or negative values', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.validateInput('0');
      });

      expect(result.current.error).toBe('Please enter a positive number');

      act(() => {
        result.current.validateInput('-5');
      });

      expect(result.current.error).toBe('Please enter a positive number');
    });

    test('returns false for values > 100', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.validateInput('150');
      });

      expect(result.current.error).toBe('Value cannot exceed 100');
    });

    test('returns true and clears error for valid input', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        const isValid = result.current.validateInput('25');
        expect(isValid).toBe(true);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('handleSave', () => {
    test('saves settings if input is valid', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.setValue('20');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockSetRecordsPerPage).toHaveBeenCalledWith(20);
      expect(alertSpy).toHaveBeenCalledWith(
        'Success',
        'Settings saved successfully'
      );
    });

    test('does not save if input is invalid', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.setValue('abc');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockSetRecordsPerPage).not.toHaveBeenCalled();
      expect(alertSpy).not.toHaveBeenCalled();
      expect(result.current.error).toBe('Please enter a valid number');
    });

    test('shows error alert if save fails', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      mockSetRecordsPerPage.mockRejectedValueOnce(new Error('fail'));

      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.setValue('10');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockSetRecordsPerPage).toHaveBeenCalledWith(10);
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to save settings');
    });
  });
});
