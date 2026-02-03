import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
  List,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/api';

const ProfileScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    age: '',
    delivery_date: '',
    support_system: '',
  });
  const [loading, setLoading] = useState(false);

  const { setUserToken } = route.params;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // First try to get from storage
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const user = JSON.parse(storedData);
        setUserData(user);
        setFormData({
          email: user.email || '',
          age: user.age?.toString() || '',
          delivery_date: user.delivery_date || '',
          support_system: user.support_system || '',
        });
      }

      // Then fetch fresh data from API
      const freshData = await authAPI.getProfile();
      setUserData(freshData);
      setFormData({
        email: freshData.email || '',
        age: freshData.age?.toString() || '',
        delivery_date: freshData.delivery_date || '',
        support_system: freshData.support_system || '',
      });
      
      // Update stored data
      await AsyncStorage.setItem('userData', JSON.stringify(freshData));
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        delivery_date: formData.delivery_date || null,
      };

      const updatedUser = await authAPI.updateProfile(updateData);
      setUserData(updatedUser);
      setEditMode(false);
      
      // Update stored data
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (userData) {
      setFormData({
        email: userData.email || '',
        age: userData.age?.toString() || '',
        delivery_date: userData.delivery_date || '',
        support_system: userData.support_system || '',
      });
    }
    setEditMode(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
              setUserToken(null);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Feature Not Available',
              'Account deletion is not available in this demo. Please contact support for assistance.'
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userData?.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Title style={styles.username}>{userData?.username || 'User'}</Title>
                <Paragraph style={styles.userType}>
                  {userData?.user_type === 'mother' ? '🤱 Mother' : '👤 User'}
                </Paragraph>
                <Paragraph style={styles.memberSince}>
                  Member since {new Date(userData?.created_at).toLocaleDateString()}
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Information */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Profile Information</Title>
              {!editMode && (
                <Button
                  mode="text"
                  onPress={() => setEditMode(true)}
                  compact
                >
                  Edit
                </Button>
              )}
            </View>

            {editMode ? (
              <View>
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={loading}
                />

                <TextInput
                  label="Age"
                  value={formData.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  disabled={loading}
                />

                <TextInput
                  label="Delivery Date"
                  value={formData.delivery_date}
                  onChangeText={(value) => handleInputChange('delivery_date', value)}
                  mode="outlined"
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  disabled={loading}
                />

                <TextInput
                  label="Support System"
                  value={formData.support_system}
                  onChangeText={(value) => handleInputChange('support_system', value)}
                  mode="outlined"
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe your support system..."
                  disabled={loading}
                />

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveButton}
                  >
                    Save
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    disabled={loading}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <List.Item
                  title="Email"
                  description={userData?.email || 'Not provided'}
                  left={(props) => <List.Icon {...props} icon="email" />}
                />
                <Divider />
                <List.Item
                  title="Age"
                  description={userData?.age ? `${userData.age} years` : 'Not provided'}
                  left={(props) => <List.Icon {...props} icon="cake" />}
                />
                <Divider />
                <List.Item
                  title="Delivery Date"
                  description={userData?.delivery_date || 'Not provided'}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                />
                <Divider />
                <List.Item
                  title="Support System"
                  description={userData?.support_system || 'Not provided'}
                  descriptionNumberOfLines={3}
                  left={(props) => <List.Icon {...props} icon="heart" />}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* App Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>About</Title>
            <Paragraph style={styles.appInfo}>
              Emotion Tracker v1.0.0
            </Paragraph>
            <Paragraph style={styles.appDescription}>
              A compassionate companion for tracking emotional wellbeing during the postpartum journey.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Settings</Title>
            
            <List.Item
              title="Notifications"
              description="Daily check-in reminders"
              left={(props) => <List.Icon {...props} icon="bell" />}
              onPress={() => {
                Alert.alert(
                  'Notifications',
                  'Notification settings will be available in the next version.'
                );
              }}
            />
            <Divider />
            
            <List.Item
              title="Privacy Policy"
              description="Learn about data privacy"
              left={(props) => <List.Icon {...props} icon="shield" />}
              onPress={() => {
                Alert.alert(
                  'Privacy Policy',
                  'Your data is encrypted and stored securely. We never share your personal information with third parties. You can delete your account at any time.'
                );
              }}
            />
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="Get help with the app"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => {
                Alert.alert(
                  'Help & Support',
                  'For support, email us at support@emotiontracker.app or call our helpline at 1-800-PPD-MOMS'
                );
              }}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <Title style={styles.dangerTitle}>Account Actions</Title>
            
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#F44336"
            >
              Logout
            </Button>
            
            <Button
              mode="text"
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
              textColor="#F44336"
            >
              Delete Account
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
  },

  headerInfo: {
    flex: 1,
  },

  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  userType: {
    color: '#4F46E5',
    fontSize: 14,
    marginTop: 2,
  },

  memberSince: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  saveButton: {
    flex: 1,
    borderRadius: 12,
  },

  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },

  appInfo: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },

  appDescription: {
    color: '#6B7280',
    lineHeight: 20,
  },

  dangerCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
  },

  dangerTitle: {
    color: '#DC2626',
    fontWeight: '700',
  },

  logoutButton: {
    marginTop: 12,
    borderRadius: 12,
    borderColor: '#DC2626',
  },

  deleteButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
