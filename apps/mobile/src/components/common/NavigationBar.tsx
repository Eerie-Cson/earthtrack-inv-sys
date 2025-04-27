import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NavigationBarProps {
  activeRoute: 'home' | 'settings' | 'profile';
  onNavigate: (route: 'home' | 'settings' | 'profile') => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeRoute,
  onNavigate,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('home')}
      >
        <Ionicons
          name={activeRoute === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={activeRoute === 'home' ? '#007AFF' : '#666'}
        />
        <Text
          style={[styles.tabText, activeRoute === 'home' && styles.activeText]}
        >
          HOME
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('settings')}
      >
        <Ionicons
          name={activeRoute === 'settings' ? 'settings' : 'settings-outline'}
          size={24}
          color={activeRoute === 'settings' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.tabText,
            activeRoute === 'settings' && styles.activeText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('profile')}
      >
        <Ionicons
          name={activeRoute === 'profile' ? 'person' : 'person-outline'}
          size={24}
          color={activeRoute === 'profile' ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.tabText,
            activeRoute === 'profile' && styles.activeText,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  activeText: {
    color: '#007AFF',
  },
});

export default NavigationBar;
