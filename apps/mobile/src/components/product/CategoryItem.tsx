import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryItemProps {
  name: string;
  icon: string;
  onPress: () => void;
}

const ICON_SOURCE = {
  toolbox: 'https://cdn-icons-png.flaticon.com/512/8576/8576054.png',
  beverages: 'https://cdn-icons-png.flaticon.com/512/3361/3361111.png',
  accessories: 'https://cdn-icons-png.flaticon.com/512/7695/7695930.png',
};

const CategoryItem: React.FC<CategoryItemProps> = ({ name, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: ICON_SOURCE[icon] }} style={styles.icon} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    width: '33%',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CategoryItem;
