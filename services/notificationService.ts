import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { platformUtils } from '@/utils/platformUtils';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  quietHoursStart: number; // Hour in 24h format (e.g., 22 for 10 PM)
  quietHoursEnd: number; // Hour in 24h format (e.g., 6 for 6 AM)
  customMessage?: string;
  smartReminders: boolean; // Skip if user drank water recently
}

export class NotificationService {
  private static instance: NotificationService;
  private notificationIdentifier: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      // Check platform limitations and provide guidance
      const limitations = platformUtils.getNotificationLimitations();
      const env = platformUtils.getEnvironmentName();
      
      console.log(`Running in ${env}:`);
      console.log(limitations.message);
      
      if (limitations.limited && limitations.recommendation) {
        console.log(`Recommendation: ${limitations.recommendation}`);
      }

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (status !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // For Android, set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('hydration-reminders', {
          name: 'Hydration Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#007BFF',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Check if it's quiet hours
  private isQuietTime(settings: ReminderSettings): boolean {
    const now = new Date();
    const currentHour = now.getHours();

    if (settings.quietHoursStart < settings.quietHoursEnd) {
      // Same day (e.g., 9 AM to 10 PM)
      return currentHour < settings.quietHoursStart || currentHour >= settings.quietHoursEnd;
    } else {
      // Overnight (e.g., 10 PM to 6 AM)
      return currentHour >= settings.quietHoursEnd && currentHour < settings.quietHoursStart;
    }
  }

  // Get motivational reminder message
  private getReminderMessage(settings: ReminderSettings, currentProgress?: number): string {
    if (settings.customMessage?.trim()) {
      return settings.customMessage;
    }

    const messages = [
      '💧 Time to hydrate! Your body needs water to function properly.',
      '🌊 Don\'t forget to drink water! Stay refreshed and energized.',
      '💙 Hydration check! Keep up with your daily water intake.',
      '🚰 Reminder: Drink some water to stay healthy and focused.',
      '💧 Your body is calling for water! Take a sip and feel better.',
    ];

    // Add progress-based messages if available
    if (currentProgress !== undefined) {
      if (currentProgress < 25) {
        messages.push('🌱 Let\'s start hydrating! You\'re just getting started.');
      } else if (currentProgress < 50) {
        messages.push('⭐ Great start! You\'re 25% towards your goal.');
      } else if (currentProgress < 75) {
        messages.push('🎯 Halfway there! Keep up the great work.');
      } else if (currentProgress < 100) {
        messages.push('🔥 Almost there! You\'re so close to your goal.');
      } else {
        messages.push('🏆 Amazing! You\'ve reached your goal. Stay hydrated!');
      }
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Validate reminder settings
  private validateReminderSettings(settings: ReminderSettings): boolean {
    // Check if interval is reasonable (at least 30 seconds, max 24 hours)
    if (settings.intervalMinutes < 0.5 || settings.intervalMinutes > 1440) {
      console.warn(`Invalid interval: ${settings.intervalMinutes} minutes. Must be between 0.5 and 1440 minutes.`);
      return false;
    }

    // Check quiet hours
    if (settings.quietHoursStart < 0 || settings.quietHoursStart > 23 || 
        settings.quietHoursEnd < 0 || settings.quietHoursEnd > 23) {
      console.warn('Invalid quiet hours. Must be between 0 and 23.');
      return false;
    }

    return true;
  }

  // Schedule a single reminder notification
  async scheduleReminder(
    settings: ReminderSettings, 
    currentProgress?: number,
    lastWaterTime?: Date
  ): Promise<string | null> {
    try {
      // Validate settings
      if (!this.validateReminderSettings(settings)) {
        console.warn('Invalid reminder settings provided');
        return null;
      }

      // Provide additional context for Expo Go users
      if (isExpoGo) {
        console.log('Scheduling notification in Expo Go - some features may be limited');
      }

      // Cancel existing notification
      await this.cancelReminder();

      if (!settings.enabled) {
        return null;
      }

      // Check if it's quiet time
      if (this.isQuietTime(settings)) {
        console.log('Skipping reminder due to quiet hours');
        // Schedule for after quiet hours end
        const now = new Date();
        const nextReminderTime = new Date();
        nextReminderTime.setHours(settings.quietHoursEnd, 0, 0, 0);
        
        // If quiet hours end is tomorrow
        if (settings.quietHoursStart > settings.quietHoursEnd && now.getHours() >= settings.quietHoursStart) {
          nextReminderTime.setDate(nextReminderTime.getDate() + 1);
        }

        // Ensure the trigger is at least 1 second in the future
        const triggerTime = Math.max(nextReminderTime.getTime(), Date.now() + 1000);
        
        this.notificationIdentifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Hydrate Mate 💧',
            body: this.getReminderMessage(settings, currentProgress),
            data: { type: 'hydration-reminder' },
          },
          trigger: { 
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(triggerTime),
          },
        });

        console.log(`Reminder scheduled for after quiet hours: ${new Date(triggerTime).toLocaleTimeString()}`);
        return this.notificationIdentifier;
      }

      // Smart reminders: skip if user drank water recently
      if (settings.smartReminders && lastWaterTime) {
        const timeSinceLastWater = Date.now() - lastWaterTime.getTime();
        const recentThreshold = 30 * 60 * 1000; // 30 minutes
        
        if (timeSinceLastWater < recentThreshold) {
          console.log('Skipping reminder - user drank water recently');
          // Schedule next reminder for the full interval
        }
      }

      // Schedule the notification
      // Ensure minimum 1 minute delay for iOS compatibility, respect the interval
      const minDelayMs = Platform.OS === 'ios' ? 60 * 1000 : 1000; // 1 minute on iOS, 1 second on Android
      const intervalMs = settings.intervalMinutes * 60 * 1000;
      let triggerTime = Date.now() + Math.max(minDelayMs, intervalMs);
      
      // Double-check the trigger time is valid
      const triggerDate = new Date(triggerTime);
      if (triggerDate <= new Date()) {
        console.warn('Trigger time is in the past, adjusting...');
        triggerTime = Date.now() + minDelayMs;
      }
      
      this.notificationIdentifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hydrate Mate 💧',
          body: this.getReminderMessage(settings, currentProgress || 0),
          data: { 
            type: 'hydration-reminder',
            scheduledAt: new Date().toISOString(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(triggerTime),
        },
      });

      console.log(`Reminder scheduled for ${new Date(triggerTime).toLocaleString()}`);
      return this.notificationIdentifier;

    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return null;
    }
  }

  // Cancel the current reminder
  async cancelReminder(): Promise<void> {
    try {
      if (this.notificationIdentifier) {
        await Notifications.cancelScheduledNotificationAsync(this.notificationIdentifier);
        this.notificationIdentifier = null;
      }
      
      // Also cancel by identifier as backup
      await Notifications.cancelScheduledNotificationAsync('hydration-reminder');
      console.log('Reminder cancelled');
    } catch (error) {
      console.error('Error cancelling reminder:', error);
    }
  }

  // Get scheduled notifications (for debugging)
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification response when user taps notification
  addNotificationResponseListener(handler: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(handler);
  }
}

export default NotificationService.getInstance();
