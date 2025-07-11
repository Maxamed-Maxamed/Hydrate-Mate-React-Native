import { supabase } from '@/backend/supabase/client';
import { User } from '@supabase/supabase-js';

// Types for authentication
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

// Email validation
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

// Name validation
const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long' };
  }
  return { isValid: true };
};

/**
 * Sign up a new user with email and password
 * @param data - User signup data
 * @returns Promise<AuthResponse>
 */
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    // Validate input data
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    const nameValidation = validateName(data.fullName);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.error };
    }

    // Attempt to sign up with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
          // Add any additional user metadata here
        },
      },
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists. Please try logging in instead.' };
      }
      if (error.message.includes('Invalid email')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (error.message.includes('Password should be at least')) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      
      // Generic error handling
      console.error('Supabase signup error:', error);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }

    if (authData.user) {
      // If user is created successfully, automatically sign them in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        // Even if auto sign-in fails, the account was created successfully
        return { success: true, user: authData.user };
      }

      return { success: true, user: signInData.user };
    }

    return { success: false, error: 'Account creation failed. Please try again.' };

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

/**
 * Sign in an existing user with email and password
 * @param data - User signin data
 * @returns Promise<AuthResponse>
 */
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    // Validate input data
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    if (!data.password.trim()) {
      return { success: false, error: 'Password is required' };
    }

    // Attempt to sign in with Supabase
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password. Please try again.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please check your email and confirm your account before signing in.' };
      }
      
      // Generic error handling
      console.error('Supabase signin error:', error);
      return { success: false, error: 'Failed to sign in. Please try again.' };
    }

    if (authData.user) {
      return { success: true, user: authData.user };
    }

    return { success: false, error: 'Sign in failed. Please try again.' };

  } catch (error) {
    console.error('Signin error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

/**
 * Sign out the current user
 * @returns Promise<AuthResponse>
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
      return { success: false, error: 'Failed to sign out. Please try again.' };
    }

    return { success: true };

  } catch (error) {
    console.error('Signout error:', error);
    return { success: false, error: 'An unexpected error occurred during sign out.' };
  }
};

/**
 * Get the current authenticated user
 * @returns Promise<User | null>
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
  
  // Return the unsubscribe function
  return data.subscription.unsubscribe;
};

/**
 * Reset password for a user
 * @param email - User's email address
 * @returns Promise<AuthResponse>
 */
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: 'hydratemate://reset-password',
    });

    if (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send password reset email. Please try again.' };
    }

    return { success: true };

  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}; 