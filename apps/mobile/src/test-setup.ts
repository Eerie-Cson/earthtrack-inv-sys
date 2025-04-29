import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = jest.fn();
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const GestureHandler = require('react-native-gesture-handler/jestSetup');
  return GestureHandler;
});

jest.spyOn(console, 'error').mockImplementation(jest.fn());
jest.spyOn(console, 'log').mockImplementation(jest.fn());
