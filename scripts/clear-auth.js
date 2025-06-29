#!/usr/bin/env node

/**
 * Script to clear authentication data and help resolve refresh token issues
 * Run this script if you're experiencing "Invalid Refresh Token" errors
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Hydrate Mate - Authentication Data Clearer');
console.log('==============================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ No .env file found!');
  console.log('Please create a .env file in your project root with:');
  console.log('EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('\nThen restart your development server with: npx expo start --clear');
  process.exit(1);
}

console.log('✅ .env file found');
console.log('\n📋 Next steps to resolve the refresh token issue:');
console.log('1. Stop your Expo development server (Ctrl+C)');
console.log('2. Clear your app data:');
console.log('   - iOS Simulator: Device → Erase All Content and Settings');
console.log('   - Android Emulator: Wipe Data in AVD Manager');
console.log('   - Physical Device: Uninstall and reinstall the app');
console.log('3. Restart your development server: npx expo start --clear');
console.log('4. Try the authentication flow again');
console.log('\n🔧 If the issue persists:');
console.log('- Check your Supabase project settings');
console.log('- Ensure your app URL is whitelisted in Supabase');
console.log('- Verify your environment variables are correct');
console.log('\n📞 For additional help, check the Supabase documentation or contact support.'); 