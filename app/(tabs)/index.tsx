import { CustomAmountModal } from '@/components/CustomAmountModal'
import { GoalSettingsModal } from '@/components/GoalSettingsModal'
import { useHydrationStore } from '@/context/hydrationStore'
import {
  formatTime,
  getDrinkEmoji,
  getMotivationalMessage,
  getQuickAddSuggestions,
  getTimeBasedGreeting,
} from '@/utils/hydrationUtils'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function Dashboard() {
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false)
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Zustand store
  const {
    dailyGoal,
    currentIntake,
    todayEntries,
    units,
    reminderSettings,
    addWaterIntake,
    removeEntry,
    updateDailyGoal,
    updateReminderSettings,
    getTodaysProgress,
    getRemainingIntake,
    initializeData,
  } = useHydrationStore()

  // Initialize data on component mount
  useEffect(() => {
    initializeData()
  }, [initializeData])

  const progressPercentage = getTodaysProgress()
  const remainingIntake = getRemainingIntake()
  const motivationalData = getMotivationalMessage(progressPercentage)
  const greeting = getTimeBasedGreeting()
  const quickAddAmounts = getQuickAddSuggestions(currentIntake, dailyGoal)

  // Handle quick add water
  const handleQuickAdd = (amount: number) => {
    addWaterIntake(amount, 'Water')
  }

  // Handle custom amount add
  const handleCustomAdd = (amount: number, type: any) => {
    addWaterIntake(amount, type)
    setIsCustomModalVisible(false)
  }

  // Handle entry removal with confirmation
  const handleRemoveEntry = (entryId: string, amount: number) => {
    Alert.alert(
      'Remove Entry',
      `Remove ${amount}ml from your daily intake?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeEntry(entryId)
        }
      ]
    )
  }

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true)
    initializeData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#007BFF"
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>Stay hydrated and healthy</Text>
          </View>
          <View style={styles.headerButtons}>
            {/* Reminder Status */}
            <TouchableOpacity 
              style={[styles.reminderButton, { backgroundColor: reminderSettings.enabled ? '#4CAF50' : '#FF9800' }]}
              onPress={() => updateReminderSettings({ enabled: !reminderSettings.enabled })}
              activeOpacity={0.7}
            >
              <Text style={styles.reminderEmoji}>
                {reminderSettings.enabled ? '🔔' : '🔕'}
              </Text>
            </TouchableOpacity>
            {/* Settings Button */}
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setIsGoalModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsEmoji}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Ring Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressRing}>
            <View style={styles.progressInner}>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentIntake}ml</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyGoal}ml</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{remainingIntake}ml</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddButtons}>
            {quickAddAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => handleQuickAdd(amount)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickAddText}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Today&apos;s Activity</Text>
          <View style={styles.activityList}>
            {todayEntries.length > 0 ? (
              todayEntries.slice(0, 5).map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.activityItem}
                  onLongPress={() => handleRemoveEntry(entry.id, entry.amount)}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityEmoji}>{getDrinkEmoji(entry.type)}</Text>
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityAmount}>+{entry.amount}ml</Text>
                    <Text style={styles.activityType}>{entry.type}</Text>
                  </View>
                  <Text style={styles.activityTime}>{formatTime(entry.timestamp)}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyActivity}>
                <Text style={styles.emptyText}>No activity yet today</Text>
                <Text style={styles.emptySubtext}>Add your first drink to get started!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Motivational Section */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationEmoji}>{motivationalData.emoji}</Text>
            <View style={styles.motivationText}>
              <Text style={styles.motivationTitle}>{motivationalData.title}</Text>
              <Text style={styles.motivationSubtitle}>
                {motivationalData.subtitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Custom Add Section */}
        <TouchableOpacity 
          style={styles.customAddButton} 
          activeOpacity={0.8}
          onPress={() => setIsCustomModalVisible(true)}
        >
          <Text style={styles.customAddText}>+ Add Custom Amount</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Custom Amount Modal */}
      <CustomAmountModal
        visible={isCustomModalVisible}
        onClose={() => setIsCustomModalVisible(false)}
        onAdd={handleCustomAdd}
        units={units}
      />

      {/* Goal Settings Modal */}
      <GoalSettingsModal
        visible={isGoalModalVisible}
        onClose={() => setIsGoalModalVisible(false)}
        currentGoal={dailyGoal}
        onUpdateGoal={updateDailyGoal}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  settingsButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsEmoji: {
    fontSize: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  reminderButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderEmoji: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  progressSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    borderWidth: 12,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressInner: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  progressLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  quickAddSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quickAddText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  activityType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  motivationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  motivationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  motivationText: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  motivationSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  customAddButton: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007BFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  customAddText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
  },
})