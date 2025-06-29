import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all authentication-related data from AsyncStorage
 * This can help resolve refresh token issues
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    // Clear all Supabase-related keys
    const keys = await AsyncStorage.getAllKeys();
    const supabaseKeys = keys.filter(key => 
      key.includes('supabase') || 
      key.includes('auth') || 
      key.includes('session')
    );
    
    if (supabaseKeys.length > 0) {
      await AsyncStorage.multiRemove(supabaseKeys);
      console.log('Cleared authentication data:', supabaseKeys);
    }
    
    // Also clear any onboarding data
    await AsyncStorage.removeItem('onboarding_completed');
    
    console.log('Authentication data cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Check if Supabase environment variables are properly configured
 */
export const checkSupabaseConfig = (): boolean => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables are missing!');
    console.error('Please create a .env file with:');
    console.error('EXPO_PUBLIC_SUPABASE_URL=your_project_url');
    console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
    return false;
  }
  
  if (supabaseUrl === 'your_supabase_project_url_here' || 
      supabaseKey === 'your_supabase_anon_key_here') {
    console.error('❌ Please replace the placeholder values in your .env file with actual Supabase credentials');
    return false;
  }
  
  console.log('✅ Supabase configuration looks good');
  return true;
}; 