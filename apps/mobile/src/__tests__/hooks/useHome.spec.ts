import { renderHook } from '@testing-library/react-hooks';
import * as ProductAPI from '../../api/product';
import { useHome } from '../../hooks/home/useHome';

describe('useHome', () => {
  const mockGetProductCategories = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(ProductAPI, 'getProductCategories')
      .mockImplementation(mockGetProductCategories);
  });

  test('fetches categories on mount and sets them', async () => {
    const mockCategories = [
      { id: 'TOOLBOX', name: 'ToolBox', icon: 'toolbox' },
      { id: 'BEVERAGES', name: 'Beverages', icon: 'beverages' },
      { id: 'ACCESSORIES', name: 'Accessories', icon: 'accessories' },
    ];

    mockGetProductCategories.mockResolvedValueOnce(mockCategories);

    const { result, waitForNextUpdate } = renderHook(() => useHome());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(mockGetProductCategories).toHaveBeenCalledTimes(1);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.isLoading).toBe(false);
  });

  test('sets isLoading to false if API call fails', async () => {
    mockGetProductCategories.mockRejectedValueOnce(new Error('API failure'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn);

    const { result, waitForNextUpdate } = renderHook(() => useHome());

    await waitForNextUpdate();

    expect(mockGetProductCategories).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch categories:',
      expect.any(Error)
    );
    expect(result.current.categories).toEqual([]);
    expect(result.current.isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
