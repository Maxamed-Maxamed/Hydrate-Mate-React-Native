import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function WelcomeScreen  () {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Logo/Illustration */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo2.png')} 
              style={styles.logo}
              alt="Hydrate-Mate Logo"
              resizeMethod="scale"
            />
          </View>
          
          {/* App Name */}
          <Text style={styles.title}>
            Hydrate Mate
          </Text>
        </View>
        
        {/* Get Started Button */}
        <Link href="../signup" asChild>
          <TouchableOpacity 
            style={styles.getStartedButton}
            activeOpacity={0.7}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.tint, // Using the primary blue color
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 56,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  getStartedButton: {
    backgroundColor: 'white',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.tint,
  }
});