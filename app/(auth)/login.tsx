import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Refs for navigation
  const passwordInputRef = useRef<TextInput>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    fadeAnim,
    slideAnim
  ]);

  const handleLogin = () => {
    // Add haptic feedback on login tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Implement login functionality
    console.log('Logging in with:', email, password);
    Keyboard.dismiss();
    
    // Navigate to main app after login
    // router.replace('/(tabs)');
    router.push('/(tabs)');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFFFFF', '#E6F7FF']}
        style={styles.gradient}
      />
      
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back! 😊</Text>
        </View>
        
        <Animated.View 
          style={[
            styles.formSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#88B7E3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordInputRef}
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#88B7E3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              <Text style={styles.passwordToggleText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>
        
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Image 
              source={require('@/assets/images/google.png')} 
              style={styles.socialIcon} 
              resizeMode="contain"
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Image 
              source={require('@/assets/images/apple.png')} 
              style={styles.socialIcon} 
              resizeMode="contain"
            />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.signupPrompt}>
          <Text style={styles.signupPromptText}>{" Don't have an account?"} </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    paddingVertical: width * 0.1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: width * 0.08,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: width * 0.04,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#0E3757',
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: width * 0.05,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 12,
    padding: width * 0.045,
    fontSize: width * 0.045,
    color: '#003366',
    borderWidth: 1,
    borderColor: '#E0F0FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: width * 0.05,
  },
  passwordInput: {
    paddingRight: width * 0.15,
  },
  passwordToggle: {
    position: 'absolute',
    right: width * 0.04,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordToggleText: {
    color: Colors.light.tint,
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    width: '100%',
    borderRadius: 25,
    padding: width * 0.045,
    alignItems: 'center',
    marginTop: width * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: width * 0.04,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: Colors.light.tint,
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width * 0.06,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#CDE3F5',
  },
  dividerText: {
    color: '#4A85B9',
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.035,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    backgroundColor: 'white',
    width: '47%',
    borderRadius: 12,
    padding: width * 0.035,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F0FF',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
  socialButtonText: {
    color: '#0E3757',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  signupPrompt: {
    flexDirection: 'row',
    marginTop: width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupPromptText: {
    color: '#4A85B9',
    fontSize: width * 0.04,
  },
  signupText: {
    color: Colors.light.tint,
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});