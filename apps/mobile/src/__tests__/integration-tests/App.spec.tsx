import { faker } from '@faker-js/faker';
import { render, waitFor } from '@testing-library/react-native';
import * as R from 'ramda';
import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import * as ProductApi from '../../api/product';
import App from '../../app/App';
import * as AuthContext from '../../contexts/AuthContext';
import { generateUser } from '../generateData';

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => {
      const Stack = ({ children }: any) => <>{children}</>;
      Stack.Screen = ({ component: Component, ...rest }: any) => (
        <Component
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
          route={{ params: {}, ...rest }}
        />
      );

      Stack.Navigator = ({ children }: any) => <>{children}</>;
      return Stack;
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
  };
});

jest.spyOn(ProductApi, 'getProducts').mockImplementation(
  jest.fn().mockResolvedValue({
    data: {
      data: [],
      nextCursor: null,
    },
  })
);

describe('🔗 App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('shows LoginScreen on fresh start (no token)', async () => {
    const { getByPlaceholderText, queryByText } = render(<App />);

    await waitFor(() => {
      expect(getByPlaceholderText('Enter your username')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(queryByText('Home')).toBeNull();
    });
  });

  it('logs in and navigates to Home', async () => {
    const user = generateUser();
    jest.spyOn(AuthContext, 'useAuthContext').mockImplementation(() => ({
      user,
      token: faker.internet.jwt(),
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    }));

    const { getAllByText, getByPlaceholderText, getAllByPlaceholderText } =
      render(<App />);
    const categories = ['ToolBox', 'Accessories', 'Beverages'];
    const capitalize: (str: string) => string = R.pipe(
      R.split(''),
      R.adjust(0, R.toUpper),
      R.join('')
    );

    await waitFor(() => {
      //Bottom Tabs
      expect(getAllByText('HOME')).toBeTruthy();
      expect(getAllByText('Profile')).toBeTruthy();
      expect(getAllByText('Settings')).toBeTruthy();

      //Top Tabs
      expect(getAllByText('Landing Page')).toBeTruthy();
      expect(getAllByText('Product Listing')).toBeTruthy();
      expect(getAllByText('Setting Page')).toBeTruthy();
      expect(getAllByText('Profile Page')).toBeTruthy();

      //Landing Page
      categories.map((category) => expect(getAllByText(category)));

      //Profiles
      expect(
        getAllByText(
          `${capitalize(user.firstname)} ${capitalize(user.lastname)}`
        )
      ).toBeTruthy();

      expect(getAllByText(capitalize(user.role))).toBeTruthy();
      expect(getAllByText(user.username)).toBeTruthy();

      //SearchBar
      expect(getByPlaceholderText('Search products...')).toBeTruthy();
      expect(getAllByPlaceholderText('input here').length).toBeGreaterThan(0);
    });
  });
});
