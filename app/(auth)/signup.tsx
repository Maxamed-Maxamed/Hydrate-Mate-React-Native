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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enhanced password strength checker
function getPasswordStrength(password: string) {
  if (!password) return '';
  if (password.length < 8) return 'Weak';
  if (password.match(/[A-Z]/) && password.match(/[a-z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Strong';
  return 'Medium';
}

export default function SignUp() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { signUpUser, isLoading } = useAuthStore();

  // State for form fields
  const [name, setName] = useState('');
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
  const handleSignUp = async () => {
    setError('');

    try {
      const result = await signUpUser({
        email: email.trim(),
        password: password,
        fullName: name.trim(),
      });

      if (result.success) {
        // Navigate directly to main app
        router.push('/(tabs)');
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Navigate to login
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Password strength
  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthColor =
    passwordStrength === 'Strong' ? '#4BB543' : passwordStrength === 'Medium' ? '#F2C94C' : '#EB5757';

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
              <Text style={[styles.headline, { fontSize: 25 * rem }]}>Let&apos;s get you hydrated!</Text>
              <Text style={[styles.subheadline, { fontSize: 15 * rem, marginTop: 4, marginBottom: vSpacing }]}>Create your free Hydrate Mate account</Text>
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
              {/* Name Input */}
              <View style={styles.inputRow}>
                <Feather name="user" size={22} color="#88B7E3" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontSize: 15 * rem }]}
                  placeholder="Full Name"
                  placeholderTextColor="#88B7E3"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  accessibilityLabel="Full Name"
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
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
              {/* Password Strength Feedback */}
              {password.length > 0 && (
                <Text style={{ color: passwordStrengthColor, fontSize: 13 * rem, marginBottom: vSpacing * 0.5, marginLeft: 8 }}>
                  Password strength: {passwordStrength}
                </Text>
              )}
              {/* Error Message */}
              {error ? (
                <Text style={{ color: '#EB5757', fontSize: 14 * rem, marginBottom: vSpacing * 0.5, marginLeft: 8 }}>{error}</Text>
              ) : null}
              {/* Create Account Button */}
              <TouchableOpacity
                style={[styles.createButton, isLoading && { opacity: 0.7 }]}
                onPress={handleSignUp}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Create Account"
                disabled={isLoading}
              >
                <Text style={[styles.createButtonText, { fontSize: 17 * rem }]}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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

            {/* Login Prompt */}
            <View style={[styles.loginPrompt, { marginTop: vSpacing * 2 }]}>
              <Text style={[styles.loginPromptText, { fontSize: 15 * rem }]}>Already have an account? </Text>
              <TouchableOpacity
                onPress={handleLogin}
                accessibilityRole="button"
                accessibilityLabel="Log In"
                disabled={isLoading}
              >
                <Text style={[styles.loginText, { fontSize: 15 * rem, marginLeft: 2 * rem }]}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

// Stylesheet for the signup screen
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
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
    minHeight: 44,
  },
  createButton: {
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
  createButtonText: {
    color: 'white',
    fontWeight: '600',
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
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptText: {
    color: '#4A85B9',
  },
  loginText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
});