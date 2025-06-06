import { Colors } from '@/constants/Colors';
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

export default function SignUp () {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs for text inputs to enable focus navigation
  const emailInputRef = useRef<TextInput>(null);
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

  const handleSignUp = () => {
    // Implement sign up functionality
    console.log('Creating account with:', name, email, password);
    Keyboard.dismiss();
    // Optionally navigate after signup
    // router.replace('/(tabs)');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Hydrate Mate today</Text>
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
              placeholder="Full Name"
              placeholderTextColor="#88B7E3"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              // autoFocus
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailInputRef}
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
              onSubmitEditing={handleSignUp}
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
            style={styles.createButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Log In</Text>
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
    justifyContent: 'space-between',
    paddingVertical: width * 0.1,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: width * 0.05,
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
  subtitle: {
    fontSize: width * 0.045,
    color: '#4A85B9',
    marginTop: width * 0.02,
    marginBottom: width * 0.04,
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
  createButton: {
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
  createButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    marginTop: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptText: {
    color: '#4A85B9',
    fontSize: width * 0.045,
  },
  loginText: {
    color: Colors.light.tint,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});