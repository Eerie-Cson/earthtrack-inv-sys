import { useState } from 'react';
import { Alert } from 'react-native';
import { useSettingsContext } from '../../contexts/SettingsContext';

export const useSettings = () => {
  const { recordsPerPage, setRecordsPerPage } = useSettingsContext();
  const [value, setValue] = useState(recordsPerPage.toString());
  const [error, setError] = useState<string | null>(null);
  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      setError('Records per page cannot be empty');
      return false;
    }

    const number = parseInt(input, 10);
    if (isNaN(number)) {
      setError('Please enter a valid number');
      return false;
    }

    if (number <= 0) {
      setError('Please enter a positive number');
      return false;
    }

    if (number > 100) {
      setError('Value cannot exceed 100');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (validateInput(value)) {
      console.log('value', value);
      try {
        await setRecordsPerPage(parseInt(value, 10));
        Alert.alert('Success', 'Settings saved successfully');
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to save settings');
      }
    }
  };

  return { error, value, setValue, handleSave, validateInput };
};
