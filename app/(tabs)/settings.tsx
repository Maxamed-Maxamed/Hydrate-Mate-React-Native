import ReminderSettingsModal from '@/components/ReminderSettingsModal';
import { Colors } from '@/constants/Colors';
import { useHydrationStore } from '@/context/hydrationStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { reminderSettings, units, updateSettings, updateReminderSettings } = useHydrationStore();
  const [showReminderModal, setShowReminderModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
    settingValue: {
      fontSize: 14,
      color: colors.tint,
      fontWeight: '500',
    },
    chevron: {
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {/* Quick Reminder Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reminders</Text>
              <Text style={styles.settingDescription}>
                {reminderSettings.enabled 
                  ? `Every ${reminderSettings.intervalMinutes >= 60 
                      ? `${Math.floor(reminderSettings.intervalMinutes / 60)}h ${reminderSettings.intervalMinutes % 60 > 0 ? `${reminderSettings.intervalMinutes % 60}m` : ''}`
                      : `${reminderSettings.intervalMinutes}m`
                    }` 
                  : 'Disabled'
                }
              </Text>
            </View>
            <Switch
              value={reminderSettings.enabled}
              onValueChange={(value) => updateReminderSettings({ enabled: value })}
              trackColor={{ false: '#E0E0E0', true: colors.tint + '50' }}
              thumbColor={reminderSettings.enabled ? colors.tint : '#F4F3F4'}
            />
          </View>

          {/* Detailed Reminder Settings */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowReminderModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reminder Settings</Text>
              <Text style={styles.settingDescription}>
                Frequency, quiet hours, and smart reminders
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>Configure</Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={colors.tabIconDefault} 
                style={styles.chevron}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Units</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred measurement unit
              </Text>
            </View>
            <Switch
              value={units === 'oz'}
              onValueChange={(value) => updateSettings({ units: value ? 'oz' : 'ml' })}
              trackColor={{ false: '#E0E0E0', true: colors.tint + '50' }}
              thumbColor={units === 'oz' ? colors.tint : '#F4F3F4'}
            />
            <Text style={[styles.settingValue, { marginLeft: 8 }]}>
              {units === 'oz' ? 'fl oz' : 'ml'}
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Hydrate Mate</Text>
              <Text style={styles.settingDescription}>
                Stay hydrated, stay healthy 💧
              </Text>
            </View>
            <Text style={styles.settingValue}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
      />
    </SafeAreaView>
  );
}