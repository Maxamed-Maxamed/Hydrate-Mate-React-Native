import { useAuthStore } from '@/context/authStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't - redirect to welcome
        router.replace('/(welcome)/welcome');
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but shouldn't be on this page - redirect to main app
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  // If we require auth and user isn't authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If we don't require auth and user is authenticated, don't render children
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 