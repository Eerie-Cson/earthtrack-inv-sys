import { render } from '@testing-library/react-native';
import React from 'react';
import App from './App';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('../contexts/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }: any) => <>{children}</>,
  };
});

jest.mock('../contexts/SettingsContext', () => {
  const React = require('react');
  return {
    SettingsProvider: ({ children }: any) => <>{children}</>,
  };
});

jest.mock('../navigation/AppNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Mocked AppNavigator</Text>;
});

describe('<App />', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('Mocked AppNavigator')).toBeTruthy();
  });
});
