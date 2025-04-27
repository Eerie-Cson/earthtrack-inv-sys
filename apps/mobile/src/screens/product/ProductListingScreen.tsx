import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getProducts } from '../../api/product';
import SearchBar from '../../components/common/SearchBar';
import ProductItem from '../../components/product/ProductItem';
import { useSettings } from '../../contexts/SettingsContext';
import { Category, Product } from '../../types';

interface ProductListingScreenProps {
  route: {
    params: {
      search?: string;
      category?: Category;
    };
  };
  navigation: any;
}

//TODO Separate Business logic and ui

const ProductListingScreen: React.FC<ProductListingScreenProps> = ({
  route,
  navigation,
}) => {
  const { search, category } = route.params || {};
  const { recordsPerPage } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<{
    [key: number]: string | undefined;
  }>({ 1: undefined });
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(search || '');

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
    fetchProducts(1, search, category);
  }, [search, category, recordsPerPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPageCursors({ 1: undefined });
    setTotalPages(1);
    fetchProducts(1, query, category);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchProducts(page, searchQuery, category);
    }
  };

  const renderPageNumbers = useCallback(() => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageNumber, currentPage === i && styles.activePage]}
          onPress={() => handlePageChange(i)}
        >
          <Text
            style={currentPage === i ? styles.activePageText : styles.pageText}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.arrowButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>

        {pages}

        <TouchableOpacity
          style={[
            styles.arrowButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
    );
  }, [currentPage, totalPages]);
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Listing</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products..."
            initialValue={searchQuery}
          />
        </View>
      </View>

      <View style={styles.content}>
        {isLoading && products.length === 0 ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#007AFF"
          />
        ) : (
          <>
            <View style={styles.productListContainerParent}>
              <FlatList
                data={products}
                renderItem={({ item }) => <ProductItem product={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.productListContainer}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No products found</Text>
                }
              />
              <View>{renderPageNumbers()}</View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#c8e6c9',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffe6cc',
  },
  backButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffe6cc',
  },
  searchBarWrapper: {
    flex: 1,
  },
  productListContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  productListContainerParent: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  paginationContainer: {
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    width: '40%',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 15,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pageNumber: {
    minWidth: 30,
    padding: 2,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePage: {},
  pageText: {
    fontSize: 16,
    color: '#000',
  },
  activePageText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ProductListingScreen;
