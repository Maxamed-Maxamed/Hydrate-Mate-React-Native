import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/context/authStore';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isLoading, cleanup } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state when the app starts
    initializeAuth();

    // Cleanup function to unsubscribe from auth state changes
    return () => {
      cleanup();
    };
  }, [initializeAuth, cleanup]);

  // Show loading screen while initializing auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
}); 