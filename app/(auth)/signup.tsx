import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Implement sign up functionality
    console.log('Sign up with:', email, password);
  };

  const handleGuestContinue = () => {
    // Handle guest flow
    console.log('Continue as guest');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
       
     
      
        <View style={styles.upperSection}>
          <Text style={styles.title}>Hydrate-Mate</Text>
          
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('@/assets/images/drink.png')} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#88B7E3"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#88B7E3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>OR</Text>
          
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleGuestContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
          
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      
      <View style={styles.wavesBackground}>
        {/* Wave shapes at the bottom */}
      </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.tint, // The blue background from your design
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  upperSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    marginVertical: 20,
    justifyContent: 'center', 
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#E6F2FF',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#003366',
  },
  signupButton: {
    backgroundColor: '#1E65A6', // Darker blue for the button
    width: '100%',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    width: '100%',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  guestButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  loginPromptText: {
    color: '#E6F2FF',
    fontSize: 16,
  },
  loginText: {
    color: '#E6F2FF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  wavesBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
  }
});