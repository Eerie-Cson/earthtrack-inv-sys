import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
