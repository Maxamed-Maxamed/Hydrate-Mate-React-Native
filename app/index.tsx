import { useAuthStore } from '@/context/authStore';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isOnboardingCompleted, isLoading: onboardingLoading } = useOnboarding();

  // Show loading while checking auth and onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // If user is authenticated, go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If onboarding is completed but user is not authenticated, go to auth
  if (isOnboardingCompleted) {
    return <Redirect href="/(auth)/login" />;
  }

  // If onboarding is not completed, start with welcome
  return <Redirect href="/(welcome)/welcome" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});