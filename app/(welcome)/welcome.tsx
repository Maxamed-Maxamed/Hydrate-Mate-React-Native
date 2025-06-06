import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Animation values using useMemo to ensure they are created only once
  const animatedValues = useMemo(() => ({
    logoOpacity: new Animated.Value(0),
    textOpacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(0)
  }), []);

  const { logoOpacity, textOpacity, buttonOpacity } = animatedValues;

  // Animation sequence
  useEffect(() => {
    // Use Animated.sequence instead of staggerSequence
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    logoOpacity,
    textOpacity,
    buttonOpacity
  ]); 

  const handleGetStarted = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFFFFF', '#E6F7FF']}
        style={styles.gradient}
      />
      
      <View style={styles.container}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Hydrate Mate logo"
          />
        </Animated.View>
        
        {/* Welcome Text */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.welcomeText}>
            Welcome to Hydrate Mate!
          </Text>
          <Text style={styles.subtitleText}>
            {"Let's stay refreshed together"} <Text style={styles.dropEmoji}>💧</Text>
          </Text>
        </Animated.View>
        
        {/* Get Started Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            activeOpacity={0.7}
            accessibilityLabel="Tap to begin hydration setup"
            accessibilityRole="button"
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingHorizontal: width * 0.07,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width * 0.1,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoImage: {
    width: width * 0.5,
    height: width * 0.5,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#0E3757',
    textAlign: 'center',
    marginBottom: width * 0.02,
  },
  subtitleText: {
    fontSize: width * 0.05,
    fontWeight: '500',
    color: '#0E3757',
    textAlign: 'center',
  },
  dropEmoji: {
    fontSize: width * 0.05,
    color: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: width * 0.05,
  },
  getStartedButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingVertical: width * 0.045,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  getStartedText: {
    fontSize: width * 0.055,
    fontWeight: '600',
    color: 'white',
  }
});