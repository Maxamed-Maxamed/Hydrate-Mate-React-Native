import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  // Mock state for UI demonstration
  const [waterIntake, setWaterIntake] = useState(1200);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  
  // Calculate progress for the ring
  const progress = waterIntake / waterGoal;
  // Ensure progress is between 0 and 1
  
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  
  const handleQuickAdd = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, waterGoal));
  };

  const handleAddWater = () => {
    // This could open a modal or navigate to a detailed input screen
    handleQuickAdd(250); // Default to adding 250ml for now
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hi Alex! 😊 { "Let's stay hydrated"}.</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        
        {/* Water Intake Tracker - Improved Droplet Design */}
        <View style={styles.trackerContainer}>
          <View style={styles.progressRingContainer}>
            {/* Water Droplet Shape Background */}
            <View style={[styles.progressBackground, { 
              backgroundColor: `rgba(0, 123, 255, ${0.1 + progress * 0.4})`
            }]}>
              <View style={styles.progressContent}>
                <Text style={styles.intakeText}>{waterIntake} ml</Text>
                <Text style={styles.goalText}>/ {waterGoal} ml</Text>
              </View>
            </View>
            
            {/* Water Level Indicator */}
            <View style={[styles.progressIndicator, {
              height: `${progress * 100}%`,
              backgroundColor: `rgba(0, 123, 255, ${0.3 + progress * 0.4})`,
            }]} />
            
            {/* Droplet Shine Effect */}
            <View style={styles.dropletShine} />
          </View>
          
          {/* Add Water Button */}
          <TouchableOpacity 
            style={styles.addWaterButton}
            activeOpacity={0.7}
            onPress={handleAddWater}
          >
            <Ionicons name="add-outline" size={24} color="white" />
            <Text style={styles.addWaterButtonText}>Add Water</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Add Buttons - Enhanced Design */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddButtons}>
            <TouchableOpacity 
              style={styles.quickAddButton} 
              onPress={() => handleQuickAdd(100)}
              activeOpacity={0.7}
            >
              <Ionicons name="water" size={20} color={Colors.light.tint} />
              <Text style={styles.quickAddAmount}>100ml</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={() => handleQuickAdd(250)}
              activeOpacity={0.7}
            >
              <Ionicons name="water" size={24} color={Colors.light.tint} />
              <Text style={styles.quickAddAmount}>250ml</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={() => handleQuickAdd(500)}
              activeOpacity={0.7}
            >
              <Ionicons name="water" size={28} color={Colors.light.tint} />
              <Text style={styles.quickAddAmount}>500ml</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Mini Stats Section - Improved Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.statsScrollView}
            contentContainerStyle={styles.statsScrollContent}
          >
            <View style={styles.statCard}>
              <Ionicons name="flame" size={28} color={Colors.light.tint} />
              <Text style={styles.statTitle}>Streak</Text>
              <Text style={styles.statValue}>5 Days</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="bar-chart" size={28} color={Colors.light.tint} />
              <Text style={styles.statTitle}>Weekly Avg</Text>
              <Text style={styles.statValue}>1800ml</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={28} color={Colors.light.tint} />
              <Text style={styles.statTitle}>Goal Completion</Text>
              <Text style={styles.statValue}>{Math.round(progress * 100)}%</Text>
            </View>
          </ScrollView>
        </View>
        
        {/* Reminder Section - Enhanced Design */}
        <View style={styles.reminderSection}>
          <View style={styles.reminderCard}>
            <View style={styles.reminderContent}>
              <Ionicons name="time" size={28} color={Colors.light.tint} />
              <View style={styles.reminderTextContainer}>
                <Text style={styles.reminderTitle}>Next Reminder</Text>
                <Text style={styles.reminderTime}>2:00 PM</Text>
              </View>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#E0E0E0', true: '#BDE3FF' }}
              thumbColor={reminderEnabled ? Colors.light.tint : '#F4F4F4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: width * 0.2,
  },
  greetingSection: {
    marginVertical: width * 0.03,
  },
  greeting: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#0E3757',
  },
  date: {
    fontSize: width * 0.035,
    color: '#88B7E3',
    marginTop: 5,
  },
  trackerContainer: {
    alignItems: 'center',
    marginVertical: width * 0.05,
  },
  progressRingContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#E0F0FF',
    marginBottom: width * 0.05,
    // Adding droplet shape - slightly narrower at top
    borderTopLeftRadius: width * 0.35,
    borderTopRightRadius: width * 0.35,
  },
  progressBackground: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  dropletShine: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '20%',
    height: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: width * 0.3,
    transform: [{ rotate: '45deg' }],
    zIndex: 3,
  },
  intakeText: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#0E3757',
  },
  goalText: {
    fontSize: width * 0.035,
    color: '#88B7E3',
  },
  addWaterButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  addWaterButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: 5,
  },
  quickAddSection: {
    marginVertical: width * 0.06,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#0E3757',
    marginBottom: width * 0.03,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: 'white',
    width: '31%',
    borderRadius: 18,
    padding: width * 0.03,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F0FF',
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    paddingVertical: width * 0.04,
  },
  quickAddAmount: {
    color: '#0E3757',
    fontSize: width * 0.04,
    fontWeight: '500',
    marginTop: 5,
  },
  statsSection: {
    marginVertical: width * 0.05,
  },
  statsScrollView: {
    marginHorizontal: -width * 0.015,
  },
  statsScrollContent: {
    paddingHorizontal: width * 0.015,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: width * 0.04,
    width: width * 0.35,
    marginRight: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0F0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    paddingVertical: width * 0.05,
  },
  statTitle: {
    color: '#88B7E3',
    fontSize: width * 0.035,
    marginTop: width * 0.02,
  },
  statValue: {
    color: '#0E3757',
    fontSize: width * 0.04,
    fontWeight: '700',
    marginTop: width * 0.01,
  },
  reminderSection: {
    marginTop: width * 0.05,
    marginBottom: width * 0.1,
  },
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTextContainer: {
    marginLeft: width * 0.03,
  },
  reminderTitle: {
    color: '#88B7E3',
    fontSize: width * 0.035,
  },
  reminderTime: {
    color: '#0E3757',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});