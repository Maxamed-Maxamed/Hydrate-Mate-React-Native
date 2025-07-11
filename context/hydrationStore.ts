import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Interface for reminder settings
export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number; // 1 minute to 8 hours (480 minutes)
  quietHours: {
    enabled: boolean;
    start: number; // Hour in 24h format (e.g., 22 for 10 PM)
    end: number;   // Hour in 24h format (e.g., 6 for 6 AM)
  };
  smartReminders: boolean; // Adjust frequency based on progress
  customMessage?: string;
}

export interface HydrationEntry {
  id: string;
  amount: number;
  timestamp: Date | string; // Allow both Date and string for persistence
  type: 'Water' | 'Tea' | 'Coffee' | 'Juice' | 'Sports Drink' | 'Other';
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalIntake: number;
  goal: number;
  entries: HydrationEntry[];
}

interface HydrationState {
  // Current day data
  dailyGoal: number;
  currentIntake: number;
  todayEntries: HydrationEntry[];
  
  // Historical data
  weeklyStats: DailyStats[];
  streak: number;
  
  // Enhanced reminder settings
  reminderSettings: ReminderSettings;
  
  // Deprecated settings (for migration)
  reminderInterval?: number; // in minutes
  reminderEnabled?: boolean;
  
  // Other settings
  units: 'ml' | 'oz';
  
  // Data version for future migrations
  dataVersion: number;
  
  // Actions
  addWaterIntake: (amount: number, type?: HydrationEntry['type']) => void;
  removeEntry: (entryId: string) => void;
  updateDailyGoal: (goal: number) => void;
  resetDay: () => void;
  getTodaysProgress: () => number;
  getRemainingIntake: () => number;
  getWeeklyAverage: () => number;
  updateSettings: (settings: Partial<Pick<HydrationState, 'units'>>) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => Promise<void>;
  startReminders: () => Promise<void>;
  stopReminders: () => Promise<void>;
  loadTodaysData: () => void;
  initializeData: () => Promise<void>;
}

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getTodayString = () => new Date().toISOString().split('T')[0];

// Default reminder settings
const defaultReminderSettings: ReminderSettings = {
  enabled: true,
  intervalMinutes: 120, // 2 hours
  quietHours: {
    enabled: true,
    start: 22, // 10 PM
    end: 6,    // 6 AM
  },
  smartReminders: true,
};

// Helper function to ensure timestamp is a Date object
const normalizeEntry = (entry: HydrationEntry): HydrationEntry => ({
  ...entry,
  timestamp: typeof entry.timestamp === 'string' ? new Date(entry.timestamp) : entry.timestamp,
});

// Helper function to normalize entries array
const normalizeEntries = (entries: HydrationEntry[]): HydrationEntry[] => 
  entries.map(normalizeEntry);

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      // Initial state
      dailyGoal: 2000, // 2L default
      currentIntake: 0,
      todayEntries: [],
      weeklyStats: [],
      streak: 0,
      reminderSettings: defaultReminderSettings,
      // Legacy fields for migration
      reminderInterval: 120, // 2 hours
      reminderEnabled: true,
      units: 'ml',
      dataVersion: 2, // Incremented for reminder settings

      // Add water intake
      addWaterIntake: (amount: number, type: HydrationEntry['type'] = 'Water') => {
        const newEntry: HydrationEntry = {
          id: generateId(),
          amount,
          timestamp: new Date(),
          type,
        };

        set((state) => {
          const newCurrentIntake = state.currentIntake + amount;
          const newTodayEntries = [newEntry, ...state.todayEntries];
          
          // Update weekly stats for today
          const today = getTodayString();
          const updatedWeeklyStats = [...state.weeklyStats];
          const todayIndex = updatedWeeklyStats.findIndex(stat => stat.date === today);
          
          if (todayIndex >= 0) {
            updatedWeeklyStats[todayIndex] = {
              ...updatedWeeklyStats[todayIndex],
              totalIntake: newCurrentIntake,
              entries: newTodayEntries,
            };
          } else {
            updatedWeeklyStats.push({
              date: today,
              totalIntake: newCurrentIntake,
              goal: state.dailyGoal,
              entries: newTodayEntries,
            });
          }

          return {
            currentIntake: newCurrentIntake,
            todayEntries: newTodayEntries,
            weeklyStats: updatedWeeklyStats,
          };
        });
        
        // Update reminder schedule if smart reminders are enabled
        const state = get();
        if (state.reminderSettings.enabled && state.reminderSettings.smartReminders) {
          // Don't await to avoid blocking the UI
          state.startReminders().catch(console.error);
        }
      },

      // Remove entry
      removeEntry: (entryId: string) => {
        set((state) => {
          const entryToRemove = state.todayEntries.find(entry => entry.id === entryId);
          if (!entryToRemove) return state;

          const newCurrentIntake = Math.max(0, state.currentIntake - entryToRemove.amount);
          const newTodayEntries = state.todayEntries.filter(entry => entry.id !== entryId);
          
          // Update weekly stats
          const today = getTodayString();
          const updatedWeeklyStats = [...state.weeklyStats];
          const todayIndex = updatedWeeklyStats.findIndex(stat => stat.date === today);
          
          if (todayIndex >= 0) {
            updatedWeeklyStats[todayIndex] = {
              ...updatedWeeklyStats[todayIndex],
              totalIntake: newCurrentIntake,
              entries: newTodayEntries,
            };
          }

          return {
            currentIntake: newCurrentIntake,
            todayEntries: newTodayEntries,
            weeklyStats: updatedWeeklyStats,
          };
        });
      },

      // Update daily goal
      updateDailyGoal: (goal: number) => {
        set((state) => {
          // Update today's goal in weekly stats
          const today = getTodayString();
          const updatedWeeklyStats = [...state.weeklyStats];
          const todayIndex = updatedWeeklyStats.findIndex(stat => stat.date === today);
          
          if (todayIndex >= 0) {
            updatedWeeklyStats[todayIndex] = {
              ...updatedWeeklyStats[todayIndex],
              goal,
            };
          }

          return {
            dailyGoal: goal,
            weeklyStats: updatedWeeklyStats,
          };
        });
      },

      // Reset day (for testing or new day)
      resetDay: () => {
        set((state) => ({
          currentIntake: 0,
          todayEntries: [],
        }));
      },

      // Get today's progress percentage
      getTodaysProgress: () => {
        const state = get();
        return Math.min((state.currentIntake / state.dailyGoal) * 100, 100);
      },

      // Get remaining intake
      getRemainingIntake: () => {
        const state = get();
        return Math.max(state.dailyGoal - state.currentIntake, 0);
      },

      // Get weekly average
      getWeeklyAverage: () => {
        const state = get();
        if (state.weeklyStats.length === 0) return 0;
        
        const totalIntake = state.weeklyStats.reduce((sum, day) => sum + day.totalIntake, 0);
        return Math.round(totalIntake / state.weeklyStats.length);
      },

      // Update settings
      updateSettings: (settings) => {
        set((state) => ({
          ...state,
          ...settings,
        }));
      },

      // Update reminder settings
      updateReminderSettings: async (newSettings: Partial<ReminderSettings>) => {
        const currentSettings = get().reminderSettings;
        const updatedSettings = { ...currentSettings, ...newSettings };
        
        // Validate interval for iOS
        if (Platform.OS === 'ios' && updatedSettings.intervalMinutes < 1) {
          console.warn('iOS requires minimum 1-minute interval, adjusting...');
          updatedSettings.intervalMinutes = 1;
        }
        
        set((state) => ({
          reminderSettings: updatedSettings,
        }));
        
        // Restart reminders with new settings
        if (updatedSettings.enabled) {
          try {
            await get().startReminders();
          } catch (error) {
            console.error('Failed to start reminders with new settings:', error);
            // Revert to previous settings on error
            set((state) => ({
              reminderSettings: currentSettings,
            }));
            throw error;
          }
        } else {
          await get().stopReminders();
        }
      },

      // Start reminders
      startReminders: async () => {
        const { reminderSettings } = get();
        if (!reminderSettings.enabled) return;
        
        try {
          const { NotificationService } = await import('@/services/notificationService');
          const currentProgress = get().getTodaysProgress();
          
          // Convert to notification service format
          const serviceSettings = {
            enabled: true,
            intervalMinutes: reminderSettings.intervalMinutes,
            smartReminders: reminderSettings.smartReminders,
            quietHoursStart: reminderSettings.quietHours.start,
            quietHoursEnd: reminderSettings.quietHours.end,
            customMessage: reminderSettings.customMessage,
          };
          
          await NotificationService.getInstance().scheduleReminder(serviceSettings, currentProgress);
        } catch (error) {
          console.error('Failed to start reminders:', error);
        }
      },

      // Stop reminders
      stopReminders: async () => {
        try {
          const { NotificationService } = await import('@/services/notificationService');
          await NotificationService.getInstance().cancelReminder();
        } catch (error) {
          console.error('Failed to stop reminders:', error);
        }
      },

      // Load today's data (check if we need to reset for new day)
      loadTodaysData: () => {
        const state = get();
        const today = getTodayString();
        const todayStats = state.weeklyStats.find(stat => stat.date === today);
        
        if (todayStats) {
          // Load existing data for today and normalize timestamps
          set({
            currentIntake: todayStats.totalIntake,
            todayEntries: normalizeEntries(todayStats.entries),
            dailyGoal: todayStats.goal,
          });
        } else {
          // New day - reset current data
          set({
            currentIntake: 0,
            todayEntries: [],
          });
        }
      },

      // Initialize data on app start with migration support
      initializeData: async () => {
        try {
          const state = get();
          
          // Check for data version and perform migrations if needed
          if (!state.dataVersion || state.dataVersion < 2) {
            console.log('🔄 Migrating data to version 2...');
            
            // Normalize any existing entries with string timestamps
            const normalizedTodayEntries = normalizeEntries(state.todayEntries);
            const normalizedWeeklyStats = state.weeklyStats.map(stat => ({
              ...stat,
              entries: normalizeEntries(stat.entries),
            }));
            
            // Migrate old reminder settings to new format
            let newReminderSettings = defaultReminderSettings;
            if (state.reminderInterval && state.reminderEnabled !== undefined) {
              newReminderSettings = {
                enabled: state.reminderEnabled,
                intervalMinutes: state.reminderInterval,
                quietHours: {
                  enabled: true,
                  start: 22, // 10 PM
                  end: 6,    // 6 AM
                },
                smartReminders: true,
              };
            }
            
            set({ 
              todayEntries: normalizedTodayEntries,
              weeklyStats: normalizedWeeklyStats,
              reminderSettings: newReminderSettings,
              dataVersion: 2 
            });
          }
          
          state.loadTodaysData();
          
          // Calculate streak (consecutive days meeting goal)
          const sortedStats = [...state.weeklyStats]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          let currentStreak = 0;
          for (const dayStats of sortedStats) {
            if (dayStats.totalIntake >= dayStats.goal) {
              currentStreak++;
            } else {
              break;
            }
          }
          
          set({ streak: currentStreak });
          console.log('✅ Hydration data initialized successfully');
          
          // Start reminders if enabled
          const finalState = get();
          if (finalState.reminderSettings.enabled) {
            finalState.startReminders().catch(console.error);
          }
        } catch (error) {
          console.error('❌ Error initializing hydration data:', error);
          // Reset to default state on error
          set({
            currentIntake: 0,
            todayEntries: [],
            weeklyStats: [],
            streak: 0,
            dataVersion: 1,
          });
        }
      },
    }),
    {
      name: 'hydration-storage',
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (key, value) => {
          // Convert timestamp strings back to Date objects
          if (key === 'timestamp' && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        },
        replacer: (key, value) => {
          // Convert Date objects to strings for storage
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        },
      }),
      // Only persist specific fields
      partialize: (state) => ({
        dailyGoal: state.dailyGoal,
        weeklyStats: state.weeklyStats,
        reminderSettings: state.reminderSettings,
        // Legacy fields for migration
        reminderInterval: state.reminderInterval,
        reminderEnabled: state.reminderEnabled,
        units: state.units,
        streak: state.streak,
        dataVersion: state.dataVersion,
      }),
    }
  )
);
