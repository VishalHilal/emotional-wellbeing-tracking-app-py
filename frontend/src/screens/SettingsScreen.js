import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Button,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotifications(parsedSettings.notifications ?? true);
        setDailyReminders(parsedSettings.dailyReminders ?? true);
        setWeeklyReports(parsedSettings.weeklyReports ?? false);
        setDarkMode(parsedSettings.darkMode ?? false);
        setDataSharing(parsedSettings.dataSharing ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleNotificationToggle = async (value) => {
    setNotifications(value);
    await saveSettings({ notifications: value, dailyReminders, weeklyReports, darkMode, dataSharing });
  };

  const handleDailyRemindersToggle = async (value) => {
    setDailyReminders(value);
    await saveSettings({ notifications, dailyReminders: value, weeklyReports, darkMode, dataSharing });
  };

  const handleWeeklyReportsToggle = async (value) => {
    setWeeklyReports(value);
    await saveSettings({ notifications, dailyReminders, weeklyReports: value, darkMode, dataSharing });
  };

  const handleDarkModeToggle = async (value) => {
    setDarkMode(value);
    await saveSettings({ notifications, dailyReminders, weeklyReports, darkMode: value, dataSharing });
    Alert.alert('Dark Mode', 'Dark mode will be available in the next update.');
  };

  const handleDataSharingToggle = async (value) => {
    setDataSharing(value);
    await saveSettings({ notifications, dailyReminders, weeklyReports, darkMode, dataSharing: value });
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your mood data will be exported as a CSV file and sent to your email. This feature will be available in the next update.'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary data but not your mood entries. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear specific cache items
              await AsyncStorage.multiRemove(['dashboardCache', 'statsCache']);
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const defaultSettings = {
                notifications: true,
                dailyReminders: true,
                weeklyReports: false,
                darkMode: false,
                dataSharing: false,
              };
              await AsyncStorage.setItem('appSettings', JSON.stringify(defaultSettings));
              setNotifications(true);
              setDailyReminders(true);
              setWeeklyReports(false);
              setDarkMode(false);
              setDataSharing(false);
              Alert.alert('Success', 'Settings reset to defaults');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notifications</Title>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications about your mood tracking"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={handleNotificationToggle}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Daily Reminders"
              description="Get reminded to check in daily"
              left={(props) => <List.Icon {...props} icon="clock" />}
              right={() => (
                <Switch
                  value={dailyReminders}
                  onValueChange={handleDailyRemindersToggle}
                  disabled={!notifications}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Weekly Reports"
              description="Receive weekly mood summaries"
              left={(props) => <List.Icon {...props} icon="chart-box" />}
              right={() => (
                <Switch
                  value={weeklyReports}
                  onValueChange={handleWeeklyReportsToggle}
                  disabled={!notifications}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Appearance</Title>
            
            <List.Item
              title="Dark Mode"
              description="Use dark theme (Coming soon)"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Privacy & Data</Title>
            
            <List.Item
              title="Data Sharing"
              description="Share anonymized data for research"
              left={(props) => <List.Icon {...props} icon="share-variant" />}
              right={() => (
                <Switch
                  value={dataSharing}
                  onValueChange={handleDataSharingToggle}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Export Data"
              description="Download your mood history"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={handleExportData}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Storage</Title>
            
            <List.Item
              title="Clear Cache"
              description="Free up storage space"
              left={(props) => <List.Icon {...props} icon="cached" />}
              onPress={handleClearCache}
            />
            <Divider />
            
            <List.Item
              title="Reset Settings"
              description="Restore default settings"
              left={(props) => <List.Icon {...props} icon="restore" />}
              onPress={handleResetSettings}
            />
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>About</Title>
            <Paragraph style={styles.versionText}>
              Emotion Tracker v1.0.0
            </Paragraph>
            <Paragraph style={styles.descriptionText}>
              A compassionate companion for tracking emotional wellbeing during the postpartum journey.
            </Paragraph>
            <View style={styles.infoLinks}>
              <Button
                mode="text"
                onPress={() => Alert.alert('Privacy Policy', 'Your data is encrypted and stored securely. We never share your personal information with third parties.')}
              >
                Privacy Policy
              </Button>
              <Button
                mode="text"
                onPress={() => Alert.alert('Terms of Service', 'By using this app, you agree to our terms of service and privacy policy.')}
              >
                Terms of Service
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#F3E5F5',
  },
  versionText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default SettingsScreen;
