import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';

export const useAuthActions = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout } = useAuthContext();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting,
    handleLogin,
    handleLogout,
  };
};
