import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reset onboarding status - useful for testing
 */
export const resetOnboardingStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('onboardingCompleted');
    console.log('Onboarding status reset successfully');
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
};

/**
 * Check if onboarding has been completed
 */
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem('onboardingCompleted');
    return status === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Mark onboarding as completed
 */
export const markOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    console.log('Onboarding marked as completed');
  } catch (error) {
    console.error('Error marking onboarding as completed:', error);
  }
}; 