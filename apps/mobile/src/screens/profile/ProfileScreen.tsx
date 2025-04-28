import * as R from 'ramda';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../../components/common/NavigationBar';
import SearchBar from '../../components/common/SearchBar';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAuthActions } from '../../hooks/auth/useAuthActions';
import { useNavigationHandlers } from '../../hooks/navigation/useAppNavigation';

interface ProfileScreenProps {
  navigation: any;
}

const capitalize: (str: string) => string = R.pipe(
  R.split(''),
  R.adjust(0, R.toUpper),
  R.join('')
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { handleLogout } = useAuthActions();
  const { user } = useAuthContext();
  const profileData = {
    fullName:
      user && user?.firstname && user?.lastname
        ? `${capitalize(user.firstname)} ${capitalize(user.lastname)}`
        : '',
    position: capitalize(user?.role) || '',
    username: capitalize(user?.username) || '',
  };

  const { handleSearch, handleNavigate } = useNavigationHandlers(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Page</Text>
      </View>

      <SearchBar onSearch={handleSearch} />

      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="#e6a8e8" />
          </View>

          <Text style={styles.fullName}>{profileData.fullName}</Text>
          <Text style={styles.position}>{profileData.position}</Text>
          <Text style={styles.username}>{profileData.username}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <NavigationBar activeRoute="profile" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6cc',
    borderColor: '#ebc166',
  },
  logoutButton: {
    backgroundColor: '#d5e8d4',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 100,
    width: 200,
    alignSelf: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderColor: 'black',
    borderWidth: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  position: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
