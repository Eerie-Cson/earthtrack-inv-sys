import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      search: 'Search',
      save: 'Save',
      cancel: 'Cancel',

      // Navigation
      home: 'HOME',
      settings: 'Settings',
      profile: 'Profile',

      // Auth
      login: 'Login',
      loginToAccount: 'Login to your account',
      username: 'Username',
      password: 'Password',
      enterUsername: 'Enter your username',
      enterPassword: 'Enter your password',

      // Home
      landingPage: 'Landing Page',

      // Products
      productListingPage: 'Product Listing page',
      noProducts: 'No products found',

      // Settings
      settingPage: 'Setting Page',
      recordsPerPage: 'records per page',
      settingsSaved: 'Settings saved successfully',

      // Validation
      cannotBeEmpty: 'Cannot be empty',
      enterValidNumber: 'Please enter a valid number',
      enterPositiveNumber: 'Please enter a positive number',
      valueLessThan100: 'Value cannot exceed 100',

      // Errors
      loginFailed: 'Login Failed',
      invalidCredentials: 'Invalid username or password',
      errorOccurred: 'An error occurred',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
