import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import NavigationBar from '../../components/common/NavigationBar';
import SearchBar from '../../components/common/SearchBar';
import CategoryItem from '../../components/product/CategoryItem';
import { useHome } from '../../hooks/home/useHome';
import { useNavigationHandlers } from '../../hooks/navigation/useAppNavigation';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { categories, isLoading } = useHome();

  const { handleSearch, handleCategoryPress, handleNavigate } =
    useNavigationHandlers(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Landing Page</Text>
      </View>

      <SearchBar onSearch={handleSearch} />

      <View style={styles.content}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryItem
                name={item.name}
                icon={item.icon}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={3}
            contentContainerStyle={styles.categoriesContainer}
          />
        )}
      </View>

      <NavigationBar activeRoute="home" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6cc',
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  categoriesContainer: {
    padding: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
