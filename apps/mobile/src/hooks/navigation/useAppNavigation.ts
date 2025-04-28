import { NavigationProp } from '@react-navigation/native';
import { CategoryData } from '../../types';

type ScreenRoute = 'home' | 'settings' | 'profile';

const navigateTo = (
  navigation: NavigationProp<any>,
  screen: string,
  params?: Record<string, any>
) => {
  navigation.navigate(screen, params);
};

export const useNavigationHandlers = (navigation: NavigationProp<any>) => {
  const handleNavigate = (route: ScreenRoute) => {
    const routeMap: Record<ScreenRoute, string> = {
      home: 'Home',
      settings: 'Settings',
      profile: 'Profile',
    };

    const screen = routeMap[route];

    navigateTo(navigation, screen);
  };

  const handleSearch = (query: string) => {
    navigateTo(navigation, 'ProductListing', { search: query });
  };

  const handleCategoryPress = (category: CategoryData) => {
    navigateTo(navigation, 'ProductListing', { category: category.name });
  };

  return { handleNavigate, handleSearch, handleCategoryPress };
};
