import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SettingsContextType {
  recordsPerPage: number;
  setRecordsPerPage: (value: number) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const DEFAULT_RECORDS_PER_PAGE = 10;

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recordsPerPage, setRecordsPerPage] = useState<number>(
    DEFAULT_RECORDS_PER_PAGE
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('recordsPerPage');
        if (storedValue) {
          setRecordsPerPage(parseInt(storedValue, 10));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateRecordsPerPage = async (value: number) => {
    try {
      await AsyncStorage.setItem('recordsPerPage', value.toString());
      setRecordsPerPage(value);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  };

  const settingsContextValue: SettingsContextType = {
    recordsPerPage,
    setRecordsPerPage: updateRecordsPerPage,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
