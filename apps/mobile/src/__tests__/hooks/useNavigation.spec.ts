import { NavigationProp } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';
import { useNavigationHandlers } from '../../hooks/navigation/useAppNavigation';

describe('useNavigationHandlers', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
  } as unknown as NavigationProp<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleNavigate', () => {
    test('navigates to Home screen', () => {
      const { result } = renderHook(() =>
        useNavigationHandlers(mockNavigation)
      );

      act(() => {
        result.current.handleNavigate('home');
      });

      expect(mockNavigate).toHaveBeenCalledWith('Home', undefined);
    });

    test('navigates to Settings screen', () => {
      const { result } = renderHook(() =>
        useNavigationHandlers(mockNavigation)
      );

      act(() => {
        result.current.handleNavigate('settings');
      });

      expect(mockNavigate).toHaveBeenCalledWith('Settings', undefined);
    });

    test('navigates to Profile screen', () => {
      const { result } = renderHook(() =>
        useNavigationHandlers(mockNavigation)
      );

      act(() => {
        result.current.handleNavigate('profile');
      });

      expect(mockNavigate).toHaveBeenCalledWith('Profile', undefined);
    });
  });

  describe('handleSearch', () => {
    test('navigates to ProductListing with search query', () => {
      const { result } = renderHook(() =>
        useNavigationHandlers(mockNavigation)
      );

      act(() => {
        result.current.handleSearch('laptop');
      });

      expect(mockNavigate).toHaveBeenCalledWith('ProductListing', {
        search: 'laptop',
      });
    });
  });

  describe('handleCategoryPress', () => {
    test('navigates to ProductListing with category', () => {
      const category = { id: '1', name: 'Electronics', icon: 'icon.png' };
      const { result } = renderHook(() =>
        useNavigationHandlers(mockNavigation)
      );

      act(() => {
        result.current.handleCategoryPress(category);
      });

      expect(mockNavigate).toHaveBeenCalledWith('ProductListing', {
        category: 'Electronics',
      });
    });
  });
});
