import ProtectedRoute from '@/components/ProtectedRoute';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/context/authStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { signInUser, isLoading } = useAuthStore();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Animation for card entrance
  const cardAnim = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardAnim, cardOpacity]);

  // Responsive units
  const rem = width / 380;
  const vSpacing = height * 0.02;

  // Handle form submission
  const handleLogin = async () => {
    setError('');

    try {
      const result = await signInUser({
        email: email.trim(),
        password: password,
      });

      if (result.success) {
        // Navigate to main app
        router.push('/(tabs)');
      } else {
        setError(result.error || 'Failed to sign in. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Navigate to signup
  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <ProtectedRoute requireAuth={false}>
      <SafeAreaView style={styles.safeArea}>
        {/* Warm inviting gradient background */}
        <LinearGradient colors={['#E6F7FF', '#B3E0FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top mascot/illustration and headline */}
            <View style={{ alignItems: 'center', marginTop: vSpacing * 2, marginBottom: vSpacing }}>
              <Image
                source={require('@/assets/images/logo2.png')}
                style={{ width: width * 0.28, height: width * 0.28, marginBottom: vSpacing }}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <Text style={[styles.headline, { fontSize: 25 * rem }]}>Welcome back!</Text>
              <Text style={[styles.subheadline, { fontSize: 15 * rem, marginTop: 4, marginBottom: vSpacing }]}>Sign in to continue your hydration journey</Text>
            </View>

            {/* Floating card for the form */}
            <Animated.View
              style={[
                styles.card,
                {
                  marginHorizontal: width * 0.05,
                  padding: vSpacing * 1.5,
                  transform: [{ translateY: cardAnim }],
                  opacity: cardOpacity,
                },
              ]}
            >
              {/* Email Input */}
              <View style={styles.inputRow}>
                <Feather name="mail" size={22} color="#88B7E3" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontSize: 15 * rem }]}
                  placeholder="Email Address"
                  placeholderTextColor="#88B7E3"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  accessibilityLabel="Email Address"
                  editable={!isLoading}
                />
              </View>
              {/* Password Input */}
              <View style={styles.inputRow}>
                <Feather name="lock" size={22} color="#88B7E3" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontSize: 15 * rem, paddingRight: 52 }]}
                  placeholder="Password"
                  placeholderTextColor="#88B7E3"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  accessibilityLabel="Password"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 2,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 44,
                    height: '100%',
                  }}
                  onPress={togglePasswordVisibility}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  disabled={isLoading}
                >
                  <Feather
                    name={!showPassword ? 'eye' : 'eye-off'}
                    size={28}
                    color={Colors.light.tint}
                  />
                </TouchableOpacity>
              </View>
              {/* Error Message */}
              {error ? (
                <Text style={{ color: '#EB5757', fontSize: 14 * rem, marginBottom: vSpacing * 0.5, marginLeft: 8 }}>{error}</Text>
              ) : null}
              {/* Log In Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && { opacity: 0.7 }, { minHeight: 48 }]}
                onPress={handleLogin}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Log In"
                disabled={isLoading}
              >
                <Text style={[styles.loginButtonText, { fontSize: 17 * rem }]}>
                  {isLoading ? 'Signing In...' : 'Log In'}
                </Text>
              </TouchableOpacity>
              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              {/* Social Signup Placeholders */}
              <View style={styles.socialRow}>
                <TouchableOpacity 
                  style={[styles.socialButton, isLoading && { opacity: 0.5 }]} 
                  activeOpacity={0.8} 
                  accessibilityRole="button" 
                  accessibilityLabel="Continue with Google"
                  disabled={isLoading}
                >
                  <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.socialButton, isLoading && { opacity: 0.5 }]} 
                  activeOpacity={0.8} 
                  accessibilityRole="button" 
                  accessibilityLabel="Continue with Apple"
                  disabled={isLoading}
                >
                  <Image source={require('@/assets/images/apple.png')} style={styles.socialIcon} />
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Signup Prompt */}
            <View style={[styles.signupPrompt, { marginTop: vSpacing * 2 }]}>
              <Text style={[styles.signupPromptText, { fontSize: 15 * rem }]}>Don&apos;t have an account? </Text>
              <TouchableOpacity 
                onPress={handleSignup} 
                accessibilityRole="button" 
                accessibilityLabel="Sign Up"
                disabled={isLoading}
              >
                <Text style={[styles.signupText, { fontSize: 15 * rem, marginLeft: 2 * rem }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

// Stylesheet for the login screen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headline: {
    fontWeight: '700',
    color: '#0E3757',
    textAlign: 'center',
  },
  subheadline: {
    color: '#4A85B9',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FAFF',
    borderRadius: 12,
    marginBottom: 14,
    paddingLeft: 10,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    color: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0F0FF',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A0B8D9',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FAFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
    marginHorizontal: 4,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialText: {
    color: '#003366',
    fontWeight: '500',
    fontSize: 15,
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupPromptText: {
    color: '#4A85B9',
    fontSize: 15,
  },
  signupText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 15,
  },
});