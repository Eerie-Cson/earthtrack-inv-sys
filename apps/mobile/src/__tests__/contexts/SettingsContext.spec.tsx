import { faker } from '@faker-js/faker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  SettingsProvider,
  useSettingsContext,
} from '../../contexts/SettingsContext';

describe('SettingsContext', () => {
  const mockRecordsPerPage = faker.number.int({
    min: 1,
    max: 100,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads stored recordsPerPage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'recordsPerPage')
        return Promise.resolve(mockRecordsPerPage.toString());
      return null;
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useSettingsContext(),
      {
        wrapper: SettingsProvider,
      }
    );

    await waitForNextUpdate();

    expect(result.current.recordsPerPage).toBe(mockRecordsPerPage);
    expect(result.current.isLoading).toBe(false);
  });

  test('sets recordsPerPage and stores it', async () => {
    const newRecordsPerPage = 20;

    const { result, waitForNextUpdate } = renderHook(
      () => useSettingsContext(),
      {
        wrapper: SettingsProvider,
      }
    );

    await waitForNextUpdate();

    await act(async () => {
      await result.current.setRecordsPerPage(newRecordsPerPage);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'recordsPerPage',
      newRecordsPerPage.toString()
    );
    expect(result.current.recordsPerPage).toBe(newRecordsPerPage);
  });

  test('sets isLoading to true during loading process', async () => {
    const { result } = renderHook(() => useSettingsContext(), {
      wrapper: SettingsProvider,
    });

    expect(result.current.isLoading).toBe(true);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await act(
      async () => await result.current.setRecordsPerPage(mockRecordsPerPage)
    );

    expect(result.current.isLoading).toBe(false);
  });
});
