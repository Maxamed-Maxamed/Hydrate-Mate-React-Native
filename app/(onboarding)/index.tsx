import { useOnboarding } from '@/hooks/useOnboarding';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  emoji: string;
  image?: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Hydrate Mate! 💧',
    description: 'Your personal hydration companion that helps you build healthy drinking habits and stay properly hydrated every day.',
    emoji: '💧',
  },
  {
    id: '2',
    title: 'Smart Water Tracking 📊',
    description: 'Log your water intake with custom amounts, track your daily progress, and visualize your hydration patterns over time.',
    emoji: '📊',
  },
  {
    id: '3',
    title: 'Intelligent Reminders ⏰',
    description: 'Get personalized reminders based on your schedule, activity level, and hydration goals to never miss a sip.',
    emoji: '⏰',
  },
  {
    id: '4',
    title: 'Gamified Experience 🏆',
    description: 'Unlock achievements, maintain streaks, and compete with yourself to make hydration fun and rewarding.',
    emoji: '🏆',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { markOnboardingCompleted } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Responsive units
  const rem = width / 380;
  const vSpacing = height * 0.025;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      // Mark onboarding as completed using the hook
      await markOnboardingCompleted();
      // Navigate to auth flow
      router.push('/(auth)/signup');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.push('/(auth)/signup');
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width: screenWidth }]}>
        <View style={styles.slideContent}>
          {/* Emoji/Icon */}
          <View style={styles.emojiContainer}>
            <Text 
              style={[styles.emoji, { fontSize: 80 * rem }]}
              accessibilityLabel={`${item.emoji} icon representing ${item.title}`}
            >
              {item.emoji}
            </Text>
          </View>

          {/* Title */}
          <Text 
            style={[styles.title, { fontSize: 28 * rem, marginBottom: vSpacing }]}
            accessibilityRole="header"
          >
            {item.title}
          </Text>

          {/* Description */}
          <Text 
            style={[styles.description, { fontSize: 18 * rem, lineHeight: 26 * rem }]}
            accessibilityRole="text"
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentIndex ? '#007AFF' : '#D1D5DB',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
            accessibilityLabel={`Page ${index + 1} of ${onboardingData.length}`}
            accessibilityRole="button"
            accessibilityState={{ selected: index === currentIndex }}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E6F7FF', '#B3E0FF', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Skip Button */}
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={handleSkip}
        accessibilityLabel="Skip onboarding and go to sign up"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={styles.flatList}
        accessibilityLabel="Onboarding slides"
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Next/Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
          accessibilityLabel={currentIndex === onboardingData.length - 1 ? "Get started with Hydrate Mate" : "Go to next slide"}
          accessibilityRole="button"
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emojiContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#0E3757',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontWeight: '400',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 36,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
}); 