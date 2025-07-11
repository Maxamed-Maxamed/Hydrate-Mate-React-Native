/**
 * Test file for notification service
 * Run this manually to test notification scheduling
 */

import { NotificationService } from './notificationService';

export const testNotifications = async () => {
  console.log('🧪 Testing notification service...');
  
  const service = NotificationService.getInstance();
  
  // Test permission request
  console.log('📱 Requesting permissions...');
  const hasPermission = await service.requestPermissions();
  console.log('Permission granted:', hasPermission);
  
  if (!hasPermission) {
    console.log('❌ Permissions denied, cannot test notifications');
    return;
  }
  
  // Test basic reminder scheduling
  console.log('⏰ Testing 1-minute reminder...');
  try {
    const testSettings = {
      enabled: true,
      intervalMinutes: 1,
      quietHoursStart: 22,
      quietHoursEnd: 6,
      smartReminders: false,
    };
    
    const reminderId = await service.scheduleReminder(testSettings, 50);
    console.log('✅ Reminder scheduled successfully:', reminderId);
    
    // Test cancellation
    setTimeout(async () => {
      console.log('🛑 Cancelling reminder...');
      await service.cancelReminder();
      console.log('✅ Reminder cancelled');
    }, 5000); // Cancel after 5 seconds
    
  } catch (error) {
    console.error('❌ Failed to schedule reminder:', error);
  }
  
  // Test edge cases
  console.log('🔍 Testing edge cases...');
  
  // Very short interval
  try {
    const shortSettings = {
      enabled: true,
      intervalMinutes: 0.1, // 6 seconds
      quietHoursStart: 22,
      quietHoursEnd: 6,
      smartReminders: false,
    };
    
    const shortReminderId = await service.scheduleReminder(shortSettings, 25);
    console.log('Short interval result:', shortReminderId);
    
    setTimeout(async () => {
      await service.cancelReminder();
    }, 2000);
    
  } catch (error) {
    console.log('Expected error for short interval:', error instanceof Error ? error.message : String(error));
  }
  
  console.log('🏁 Test completed');
};

// Export for manual testing
// To test: import { testNotifications } from './testNotifications'; testNotifications();
