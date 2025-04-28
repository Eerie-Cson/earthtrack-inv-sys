import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../../components/common/NavigationBar';
import SearchBar from '../../components/common/SearchBar';
import { useNavigationHandlers } from '../../hooks/navigation/useAppNavigation';
import { useSettings } from '../../hooks/settings/useSettings';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { error, setValue, handleSave, value, validateInput } = useSettings();
  const { handleSearch, handleNavigate } = useNavigationHandlers(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setting Page</Text>
      </View>

      <SearchBar onSearch={handleSearch} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="records per page"
              value={value}
              onChangeText={(text) => {
                setValue(text);
                validateInput(text);
              }}
              keyboardType="numeric"
              maxLength={3}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="#000" />
            <Text style={styles.saveButtonText}>save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <NavigationBar activeRoute="settings" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6cc',
    borderColor: '#ebc166',
  },
  header: {
    backgroundColor: '#c8e6c9',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    borderColor: '#ddd',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  inputError: {
    borderColor: 'red',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  saveButtonText: {
    marginLeft: 8,
  },
});

export default SettingsScreen;
