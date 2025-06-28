import ProtectedRoute from '@/components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Responsive units
  const rem = width / 380;
  const vSpacing = height * 0.025;

  // Animation values
  const logoAnim = useRef(new Animated.Value(60)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(60)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(60)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(250, [
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [logoAnim, logoOpacity, textAnim, textOpacity, buttonAnim, buttonOpacity]);

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  // Button press animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#E6F7FF', '#B3E0FF', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: width * 0.07 }}>
              {/* Mascot/Logo Section */}
              <Animated.View
                style={{
                  opacity: logoOpacity,
                  transform: [{ translateY: logoAnim }],
                  marginTop: vSpacing * 2,
                  marginBottom: vSpacing * 1.5,
                }}
              >
                <Image
                  source={require('@/assets/images/logo2.png')}
                  style={{ width: width * 0.42, height: width * 0.42, marginBottom: vSpacing }}
                  resizeMode="contain"
                  accessibilityLabel="Hydrate Mate mascot logo"
                />
              </Animated.View>
              {/* Headline and Subtitle */}
              <Animated.View
                style={{
                  opacity: textOpacity,
                  transform: [{ translateY: textAnim }],
                  alignItems: 'center',
                  marginBottom: vSpacing * 2,
                }}
              >
                <Text style={{ fontSize: 32 * rem, fontWeight: '700', color: '#0E3757', textAlign: 'center', marginBottom: 8 }}>
                  Welcome to Hydrate Mate!
                </Text>
                <Text style={{ fontSize: 19 * rem, fontWeight: '500', color: '#0E3757', textAlign: 'center' }}>
                  Let&apos;s stay refreshed together <Text style={{ color: '#007AFF', fontSize: 19 * rem }}>💧</Text>
                </Text>
              </Animated.View>
              {/* Get Started Button */}
              <Animated.View
                style={{
                  opacity: buttonOpacity,
                  transform: [{ translateY: buttonAnim }],
                  width: '100%',
                  marginBottom: vSpacing * 2.5,
                }}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#007AFF',
                      borderRadius: 36,
                      paddingVertical: width * 0.06,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.15,
                      shadowRadius: 5,
                      elevation: 5,
                    }}
                    activeOpacity={0.8}
                    accessibilityLabel="Tap to begin hydration setup"
                    accessibilityRole="button"
                    onPress={handleGetStarted}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                  >
                    <Text style={{ fontSize: 22 * rem, fontWeight: '700', color: 'white', letterSpacing: 0.5 }}>
                      Get Started
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});