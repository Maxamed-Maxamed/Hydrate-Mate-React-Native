import { useAuthStore } from '@/context/authStore';
import { useOnboarding } from '@/hooks/useOnboarding';
import * as SecureStore from 'expo-secure-store';

/**
 * Debug utility to help troubleshoot authentication and onboarding flow issues
 */
export const useDebugInfo = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isOnboardingCompleted, isLoading: onboardingLoading } = useOnboarding();

  const getDebugInfo = async () => {
    try {
      const onboardingStatus = await SecureStore.getItemAsync('onboardingCompleted');
      
      const debugInfo = {
        auth: {
          isAuthenticated,
          userId: user?.id || null,
          userEmail: user?.email || null,
          isLoading: authLoading,
        },
        onboarding: {
          isCompleted: isOnboardingCompleted,
          isLoading: onboardingLoading,
          rawStorageValue: onboardingStatus,
        },
        navigation: {
          shouldShowWelcome: !isOnboardingCompleted && !isAuthenticated,
          shouldShowAuth: isOnboardingCompleted && !isAuthenticated,
          shouldShowTabs: isAuthenticated,
        },
        timestamp: new Date().toISOString(),
      };

      console.log('🐛 DEBUG INFO:', JSON.stringify(debugInfo, null, 2));
      return debugInfo;
    } catch (error) {
      console.error('Error getting debug info:', error);
      return null;
    }
  };

  const resetAllData = async () => {
    try {
      // Clear onboarding data
      await SecureStore.deleteItemAsync('onboardingCompleted');
      
      // Sign out user
      const { signOutUser } = useAuthStore.getState();
      await signOutUser();
      
      console.log('🧹 All data cleared for debugging');
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  };

  return {
    getDebugInfo,
    resetAllData,
  };
};
