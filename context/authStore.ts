import { getCurrentUser, onAuthStateChange, signIn, SignInData, signOut, signUp, SignUpData } from '@/services/auth';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initializeAuth: () => Promise<void>;
  signUpUser: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signInUser: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize authentication state
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Get current user
      const user = await getCurrentUser();
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }

      // Listen for auth state changes
      onAuthStateChange((user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      });

    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  // Sign up user
  signUpUser: async (data: SignUpData) => {
    try {
      set({ isLoading: true });
      
      const result = await signUp(data);
      
      if (result.success && result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
      
      return result;
    } catch (error) {
      console.error('Signup error in store:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An unexpected error occurred during signup.' 
      };
    }
  },

  // Sign in user
  signInUser: async (data: SignInData) => {
    try {
      set({ isLoading: true });
      
      const result = await signIn(data);
      
      if (result.success && result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
      
      return result;
    } catch (error) {
      console.error('Signin error in store:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An unexpected error occurred during signin.' 
      };
    }
  },

  // Sign out user
  signOutUser: async () => {
    try {
      set({ isLoading: true });
      
      const result = await signOut();
      
      if (result.success) {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
      
      return result;
    } catch (error) {
      console.error('Signout error in store:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An unexpected error occurred during signout.' 
      };
    }
  },

  // Set user directly (for testing or manual updates)
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
})); 