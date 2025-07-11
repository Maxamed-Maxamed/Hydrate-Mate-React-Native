import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { platformUtils } from '@/utils/platformUtils';

interface NotificationLimitationBannerProps {
  onDismiss?: () => void;
}

export const NotificationLimitationBanner: React.FC<NotificationLimitationBannerProps> = ({
  onDismiss,
}) => {
  const limitations = platformUtils.getNotificationLimitations();

  // Don't show banner if notifications are fully supported
  if (!limitations.limited) {
    return null;
  }

  const handleLearnMore = () => {
    Alert.alert(
      'Development Build Info',
      `${limitations.message}\n\n${limitations.recommendation}\n\nThis will give you:\n• Full notification support\n• Better performance\n• All native features\n• Hot reloading`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Learn More',
          onPress: () => Linking.openURL('https://docs.expo.dev/develop/development-builds/introduction/'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⚠️</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Limited Notifications</Text>
          <Text style={styles.subtitle}>
            Running in Expo Go. Some notification features may not work fully.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLearnMore}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Fix</Text>
        </TouchableOpacity>
      </View>
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissText: {
    fontSize: 18,
    color: '#856404',
    fontWeight: 'bold',
  },
});
