import { faker } from '@faker-js/faker';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as ProductAPI from '../../api/product';
import * as SettingsContext from '../../contexts/SettingsContext';
import { useProductListing } from '../../hooks/product/useProduct';
import { generateProduct } from '../generateData';

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
      const product = generateProduct();
      const mockData = {
        data: {
          data: [product],
          nextCursor: faker.string.hexadecimal(),
        },
      };

      mockGetProducts.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetProducts).toHaveBeenCalledWith({
        limit: 10,
        cursor: undefined,
        sort: 'desc',
      });

      expect(result.current.products).toEqual(mockData.data.data);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(2);
    });
  });

  describe('handleSearch', () => {
    test('updates products and search query on handleSearch', async () => {
      const initialProduct = generateProduct();
      const searchProduct = generateProduct();
      const initialData = {
        data: {
          data: [initialProduct],
          nextCursor: 'cursor2',
        },
      };

      const searchData = {
        data: {
          data: [searchProduct],
          nextCursor: undefined,
        },
      };

      mockGetProducts
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(searchData);

      const { result } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearch('ToolBox');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.searchQuery).toBe('ToolBox');
      });

      expect(mockGetProducts).toHaveBeenLastCalledWith({
        limit: 10,
        cursor: undefined,
        sort: 'desc',
        name: 'ToolBox',
      });

      expect(result.current.products).toEqual(searchData.data.data);
    });
  });

  describe('handlePageChange', () => {
    test('fetches next page of products if within bounds', async () => {
      const firstPageProduct = generateProduct();
      const secondPageProduct = generateProduct();
      const page1 = {
        data: {
          data: [firstPageProduct],
          nextCursor: 'cursor2',
        },
      };

      const page2 = {
        data: {
          data: [secondPageProduct],
          nextCursor: undefined,
        },
      };

      mockGetProducts.mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

      const { result } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      await waitFor(() => {
        expect(result.current.currentPage).toBe(2);
      });

      expect(mockGetProducts).toHaveBeenLastCalledWith({
        limit: 10,
        cursor: 'cursor2',
        sort: 'desc',
      });

      expect(result.current.products).toEqual(page2.data.data);
    });

    test('does not fetch if page is out of bounds', async () => {
      const mockData = {
        data: {
          data: [generateProduct()],
          nextCursor: undefined,
        },
      };

      mockGetProducts.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() =>
        useProductListing({}, mockNavigation)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(mockGetProducts).toHaveBeenCalledTimes(1); // Only initial call
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
