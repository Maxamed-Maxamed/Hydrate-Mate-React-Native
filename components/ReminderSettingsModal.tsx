import { Colors } from '@/constants/Colors';
import { ReminderSettings, useHydrationStore } from '@/context/hydrationStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ReminderSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReminderSettingsModal({ visible, onClose }: ReminderSettingsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { reminderSettings, updateReminderSettings } = useHydrationStore();
  const [localSettings, setLocalSettings] = useState<ReminderSettings>(reminderSettings);
  const [saving, setSaving] = useState(false);

  // Interval options - iOS requires minimum 1 minute for reliable notifications
  const intervalOptions = Platform.OS === 'ios' 
    ? [
        { label: '1 minute', value: 1 },
        { label: '5 minutes', value: 5 },
        { label: '15 minutes', value: 15 },
        { label: '30 minutes', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '1.5 hours', value: 90 },
        { label: '2 hours', value: 120 },
        { label: '3 hours', value: 180 },
        { label: '4 hours', value: 240 },
        { label: '5 hours', value: 300 },
        { label: '6 hours', value: 360 },
        { label: '8 hours', value: 480 },
      ]
    : [
        { label: '30 seconds', value: 0.5 },
        { label: '1 minute', value: 1 },
        { label: '5 minutes', value: 5 },
        { label: '15 minutes', value: 15 },
        { label: '30 minutes', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '1.5 hours', value: 90 },
        { label: '2 hours', value: 120 },
        { label: '3 hours', value: 180 },
        { label: '4 hours', value: 240 },
        { label: '5 hours', value: 300 },
        { label: '6 hours', value: 360 },
        { label: '8 hours', value: 480 },
      ];

  // Hour options for quiet hours
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    value: i,
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate settings before saving
      if (localSettings.enabled && localSettings.intervalMinutes < (Platform.OS === 'ios' ? 1 : 0.5)) {
        Alert.alert(
          'Invalid Interval',
          Platform.OS === 'ios' 
            ? 'iOS requires a minimum interval of 1 minute for reliable notifications.'
            : 'Minimum interval is 30 seconds.'
        );
        setSaving(false);
        return;
      }

      await updateReminderSettings(localSettings);
      onClose();
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
      Alert.alert(
        'Error', 
        'Failed to save reminder settings. Please check your notification permissions and try again.',
        [
          { 
            text: 'Open Settings', 
            onPress: () => {
              // On iOS, users need to go to Settings app
              Alert.alert(
                'Notification Permissions',
                'Please go to Settings > Notifications > Hydrate Mate and enable notifications.'
              );
            }
          },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalSettings(reminderSettings); // Reset to original settings
    onClose();
  };

  const updateLocalSetting = <K extends keyof ReminderSettings>(
    key: K,
    value: ReminderSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateQuietHoursSetting = <K extends keyof ReminderSettings['quietHours']>(
    key: K,
    value: ReminderSettings['quietHours'][K]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value },
    }));
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    headerButton: {
      padding: 5,
    },
    headerButtonText: {
      fontSize: 16,
      color: colors.tint,
      fontWeight: '500',
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    settingLabel: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.tabIconDefault,
      marginTop: 4,
    },
    intervalGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },
    intervalButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      minWidth: 80,
      alignItems: 'center',
    },
    intervalButtonActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    intervalButtonText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '500',
    },
    intervalButtonTextActive: {
      color: 'white',
    },
    customMessageInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.background,
      marginTop: 10,
      minHeight: 44,
    },
    quietHoursRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      marginTop: 10,
    },
    hourPicker: {
      flex: 1,
    },
    hourPickerButton: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    hourPickerText: {
      fontSize: 14,
      color: colors.text,
    },
    infoCard: {
      backgroundColor: colors.tabIconDefault + '10',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    infoText: {
      fontSize: 13,
      color: colors.tabIconDefault,
      lineHeight: 18,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
          >
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Reminder Settings</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={[styles.headerButtonText, saving && { opacity: 0.5 }]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
            {/* Enable Reminders */}
            <View style={styles.section}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Enable Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get notifications to remind you to drink water
                  </Text>
                </View>
                <Switch
                  value={localSettings.enabled}
                  onValueChange={(value) => updateLocalSetting('enabled', value)}
                  trackColor={{ false: '#E0E0E0', true: colors.tint + '50' }}
                  thumbColor={localSettings.enabled ? colors.tint : '#F4F3F4'}
                />
              </View>
            </View>

            {/* Reminder Interval */}
            {localSettings.enabled && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reminder Frequency</Text>
                <Text style={styles.settingDescription}>
                  How often would you like to be reminded?
                </Text>
                
                <View style={styles.intervalGrid}>
                  {intervalOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.intervalButton,
                        localSettings.intervalMinutes === option.value && styles.intervalButtonActive,
                      ]}
                      onPress={() => updateLocalSetting('intervalMinutes', option.value)}
                    >
                      <Text
                        style={[
                          styles.intervalButtonText,
                          localSettings.intervalMinutes === option.value && styles.intervalButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Smart Reminders */}
            {localSettings.enabled && (
              <View style={styles.section}>
                <View style={styles.settingRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>Smart Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Automatically adjust reminder frequency based on your hydration progress
                    </Text>
                  </View>
                  <Switch
                    value={localSettings.smartReminders}
                    onValueChange={(value) => updateLocalSetting('smartReminders', value)}
                    trackColor={{ false: '#E0E0E0', true: colors.tint + '50' }}
                    thumbColor={localSettings.smartReminders ? colors.tint : '#F4F3F4'}
                  />
                </View>
              </View>
            )}

            {/* Quiet Hours */}
            {localSettings.enabled && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quiet Hours</Text>
                
                <View style={styles.settingRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>Enable Quiet Hours</Text>
                    <Text style={styles.settingDescription}>
                      No reminders during selected hours
                    </Text>
                  </View>
                  <Switch
                    value={localSettings.quietHours.enabled}
                    onValueChange={(value) => updateQuietHoursSetting('enabled', value)}
                    trackColor={{ false: '#E0E0E0', true: colors.tint + '50' }}
                    thumbColor={localSettings.quietHours.enabled ? colors.tint : '#F4F3F4'}
                  />
                </View>

                {localSettings.quietHours.enabled && (
                  <View style={styles.quietHoursRow}>
                    <View style={styles.hourPicker}>
                      <Text style={styles.settingDescription}>From</Text>
                      <TouchableOpacity
                        style={styles.hourPickerButton}
                        onPress={() => {
                          Alert.alert(
                            'Select Start Hour',
                            'Choose the hour when quiet time begins',
                            hourOptions.map(option => ({
                              text: option.label,
                              onPress: () => updateQuietHoursSetting('start', option.value),
                            }))
                          );
                        }}
                      >
                        <Text style={styles.hourPickerText}>
                          {hourOptions.find(h => h.value === localSettings.quietHours.start)?.label || '22:00'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.hourPicker}>
                      <Text style={styles.settingDescription}>To</Text>
                      <TouchableOpacity
                        style={styles.hourPickerButton}
                        onPress={() => {
                          Alert.alert(
                            'Select End Hour',
                            'Choose the hour when quiet time ends',
                            hourOptions.map(option => ({
                              text: option.label,
                              onPress: () => updateQuietHoursSetting('end', option.value),
                            }))
                          );
                        }}
                      >
                        <Text style={styles.hourPickerText}>
                          {hourOptions.find(h => h.value === localSettings.quietHours.end)?.label || '06:00'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Custom Message */}
            {localSettings.enabled && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Custom Message</Text>
                <Text style={styles.settingDescription}>
                  Personalize your reminder message (optional)
                </Text>
                
                <TextInput
                  style={styles.customMessageInput}
                  value={localSettings.customMessage || ''}
                  onChangeText={(text) => updateLocalSetting('customMessage', text || undefined)}
                  placeholder="e.g., Time to hydrate! 💧"
                  placeholderTextColor={colors.tabIconDefault}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                💡 Smart reminders will remind you more frequently when you&apos;re behind on your daily goal and less frequently when you&apos;re on track. 
                {'\n\n'}
                🔕 Quiet hours prevent notifications during sleep or focus time. 
                {'\n\n'}
                {Platform.OS === 'ios' && '⏰ iOS requires a minimum 1-minute interval for reliable notifications.\n\n'}
                🎯 All reminders respect your device&apos;s notification settings and can be disabled in your phone&apos;s settings.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
