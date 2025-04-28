import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '../../api/product';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { Category, Product } from '../../types';

export const useProductListing = (
  routeParams?: { search?: string; category?: Category },
  navigation?: any
) => {
  const { recordsPerPage } = useSettingsContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<{
    [key: number]: string | undefined;
  }>({ 1: undefined });
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(routeParams.search || '');

  const fetchProducts = useCallback(
    async (page: number, newSearch?: string, newCategory?: Category) => {
      setIsLoading(true);
      try {
        const params = {
          limit: recordsPerPage,
          cursor: pageCursors[page],
          sort: 'desc' as 'asc' | 'desc',
          ...(newSearch && { name: newSearch }),
          ...(newCategory && { category: newCategory }),
        };

        const response = await getProducts(params);
        const newProducts = response.data.data || [];
        const nextCursor = response.data.nextCursor;

        setProducts(newProducts);

        if (nextCursor && !pageCursors[page + 1]) {
          setPageCursors((prev) => ({ ...prev, [page + 1]: nextCursor }));
          setTotalPages((prev) =>
            nextCursor ? Math.max(prev, page + 1) : prev
          );
        }

        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [recordsPerPage, pageCursors]
  );

  useEffect(() => {
    fetchProducts(1, routeParams.search, routeParams.category);
  }, [routeParams.search, routeParams.category, recordsPerPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPageCursors({ 1: undefined });
    setTotalPages(1);
    fetchProducts(1, query, routeParams.category);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchProducts(page, searchQuery, routeParams.category);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    products,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    handleSearch,
    handlePageChange,
    handleGoBack,
  };
};
