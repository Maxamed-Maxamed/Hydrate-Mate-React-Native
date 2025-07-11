import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const OLD_ONBOARDING_KEY = 'onboardingCompleted';
const NEW_ONBOARDING_KEY = 'onboardingCompleted';

/**
 * Migrate onboarding data from AsyncStorage to SecureStore
 * This ensures backward compatibility for existing users
 */
export const migrateOnboardingData = async (): Promise<void> => {
  try {
    // Check if data already exists in SecureStore
    const secureStoreValue = await SecureStore.getItemAsync(NEW_ONBOARDING_KEY);
    if (secureStoreValue !== null) {
      // Data already migrated, nothing to do
      return;
    }

    // Check for old data in AsyncStorage
    const asyncStorageValue = await AsyncStorage.getItem(OLD_ONBOARDING_KEY);
    if (asyncStorageValue !== null) {
      // Migrate the data
      await SecureStore.setItemAsync(NEW_ONBOARDING_KEY, asyncStorageValue);
      
      // Clean up old data
      await AsyncStorage.removeItem(OLD_ONBOARDING_KEY);
      
      console.log('Successfully migrated onboarding data to SecureStore');
    }
  } catch (error) {
    console.error('Error migrating onboarding data:', error);
    // Migration failure is not critical, the app can still function
  }
};
