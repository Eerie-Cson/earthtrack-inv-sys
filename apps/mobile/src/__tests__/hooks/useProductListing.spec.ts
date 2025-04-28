import { act, renderHook } from '@testing-library/react-hooks';
import * as ProductAPI from '../../api/product';
import * as SettingsContext from '../../contexts/SettingsContext';
import { useProductListing } from '../../hooks/product/useProduct';
describe('useProductListing', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockGetProducts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(ProductAPI, 'getProducts').mockImplementation(mockGetProducts);

    jest.spyOn(SettingsContext, 'useSettingsContext').mockReturnValue({
      recordsPerPage: 10,
      isLoading: false,
      setRecordsPerPage: jest.fn(),
    });
  });

  describe('initial fetch', () => {
    test('fetches products on mount with no route params', async () => {
      const mockData = {
        data: {
          data: [{ id: '1', name: 'Product 1' }],
          nextCursor: 'cursor2',
        },
      };

      mockGetProducts.mockResolvedValueOnce(mockData);

      const { result, waitForNextUpdate } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      expect(result.current.isLoading).toBe(true);

      await waitForNextUpdate();

      expect(mockGetProducts).toHaveBeenCalledWith({
        limit: 10,
        cursor: undefined,
        sort: 'desc',
      });

      expect(result.current.products).toEqual(mockData.data.data);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(2);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('handleSearch', () => {
    test('updates products and search query on handleSearch', async () => {
      const initialData = {
        data: {
          data: [{ id: '1', name: 'Initial Product' }],
          nextCursor: 'cursor2',
        },
      };

      const searchData = {
        data: {
          data: [{ id: '2', name: 'Search Result' }],
          nextCursor: undefined,
        },
      };

      mockGetProducts
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(searchData);

      const { result, waitForNextUpdate } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitForNextUpdate();

      act(() => {
        result.current.handleSearch('Shoe');
      });

      await waitForNextUpdate();
      expect(mockGetProducts).toHaveBeenLastCalledWith({
        limit: 10,
        cursor: undefined,
        sort: 'desc',
        name: 'Shoe',
      });

      expect(result.current.products).toEqual(searchData.data.data);
      expect(result.current.searchQuery).toBe('Shoe');
    });
  });

  describe('handlePageChange', () => {
    test('fetches next page of products if within bounds', async () => {
      const page1 = {
        data: {
          data: [{ id: '1', name: 'Product 1' }],
          nextCursor: 'cursor2',
        },
      };

      const page2 = {
        data: {
          data: [{ id: '2', name: 'Product 2' }],
          nextCursor: undefined,
        },
      };

      mockGetProducts.mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

      const { result, waitForNextUpdate } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitForNextUpdate(); // first page

      act(() => {
        result.current.handlePageChange(2);
      });

      await waitForNextUpdate(); // second page

      expect(mockGetProducts).toHaveBeenLastCalledWith({
        limit: 10,
        cursor: 'cursor2',
        sort: 'desc',
      });

      expect(result.current.products).toEqual(page2.data.data);
      expect(result.current.currentPage).toBe(2);
    });

    test('does not fetch if page is out of bounds', async () => {
      const mockData = {
        data: {
          data: [{ id: '1', name: 'Only Page' }],
          nextCursor: undefined,
        },
      };

      mockGetProducts.mockResolvedValueOnce(mockData);

      const { result, waitForNextUpdate } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitForNextUpdate();

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(mockGetProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleGoBack', () => {
    test('calls navigation.goBack()', () => {
      const { result } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      act(() => {
        result.current.handleGoBack();
      });

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
