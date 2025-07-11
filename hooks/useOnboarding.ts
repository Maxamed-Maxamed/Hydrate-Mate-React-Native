import { migrateOnboardingData } from '@/utils/migrateOnboardingData';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const ONBOARDING_KEY = 'onboardingCompleted';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const status = await SecureStore.getItemAsync(ONBOARDING_KEY);
      setIsOnboardingCompleted(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeOnboarding = useCallback(async () => {
    try {
      // First, migrate any existing data from AsyncStorage to SecureStore
      await migrateOnboardingData();
      
      // Then check the onboarding status
      await checkOnboardingStatus();
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      setIsOnboardingCompleted(false);
      setIsLoading(false);
    }
  }, [checkOnboardingStatus]);

  useEffect(() => {
    initializeOnboarding();
  }, [initializeOnboarding]);

  const markOnboardingCompleted = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      setIsOnboardingCompleted(true);
      return true;
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
      return false;
    }
  };

  const resetOnboarding = async () => {
    try {
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      setIsOnboardingCompleted(false);
      return true;
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
      return false;
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    markOnboardingCompleted,
    resetOnboarding,
  };
}; 