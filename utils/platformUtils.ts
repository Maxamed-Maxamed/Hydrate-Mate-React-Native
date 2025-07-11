import Constants from 'expo-constants';

// Platform utilities for handling different environments
export const platformUtils = {
  // Check if running in Expo Go
  isExpoGo: Constants.appOwnership === 'expo',
  
  // Check if running in a development build
  isDevelopmentBuild: Constants.appOwnership !== 'expo',
  
  // Get platform-specific notification limitations
  getNotificationLimitations: () => {
    if (platformUtils.isExpoGo) {
      return {
        limited: true,
        message: 'Notifications are limited in Expo Go. For full functionality, use a development build.',
        recommendation: 'Run "npx expo install expo-dev-client" and use "npx expo run:ios" or "npx expo run:android"'
      };
    }
    return {
      limited: false,
      message: 'Full notification support available',
      recommendation: null
    };
  },
  
  // Check if current environment supports full notifications
  supportsFullNotifications: () => !platformUtils.isExpoGo,
  
  // Get environment name for logging
  getEnvironmentName: () => {
    if (platformUtils.isExpoGo) return 'Expo Go';
    if (platformUtils.isDevelopmentBuild) return 'Development Build';
    return 'Production';
  }
};
