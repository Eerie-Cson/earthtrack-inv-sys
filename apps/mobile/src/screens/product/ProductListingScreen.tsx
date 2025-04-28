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
import SearchBar from '../../components/common/SearchBar';
import ProductItem from '../../components/product/ProductItem';
import { useProductListing } from '../../hooks/product/useProduct';
import { Category } from '../../types';
import Pagination from './Pagination';

interface ProductListingScreenProps {
  route: {
    params: {
      search?: string;
      category?: Category;
    };
  };
  navigation: any;
}

const ProductListingScreen: React.FC<ProductListingScreenProps> = ({
  route,
  navigation,
}) => {
  const {
    products,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    handleSearch,
    handlePageChange,
    handleGoBack,
  } = useProductListing(route.params || {}, navigation);

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
              <View>
                {
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                }
              </View>
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
