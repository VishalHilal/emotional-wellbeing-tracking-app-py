import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Divider,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
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
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const getUserInitials = () => {
    if (userData?.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getStreakInfo = () => {
    // This would typically come from your API
    return {
      streak: 7,
      lastCheckIn: 'Today'
    };
  };

  const { streak, lastCheckIn } = getStreakInfo();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text
            size={64}
            label={getUserInitials()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <Title style={styles.username}>
            {userData?.username || 'User'}
          </Title>
          <Caption style={styles.userType}>
            {userData?.user_type === 'mother' ? '🤱 Mother' : '👤 User'}
          </Caption>
        </View>
        
        {/* Streak Info */}
        <View style={styles.streakContainer}>
          <View style={styles.streakItem}>
            <Title style={styles.streakNumber}>{streak}</Title>
            <Caption style={styles.streakLabel}>Day Streak</Caption>
          </View>
          <View style={styles.streakItem}>
            <Title style={styles.streakNumber}>🔥</Title>
            <Caption style={styles.streakLabel}>{lastCheckIn}</Caption>
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <DrawerItemList {...props} />
        
        {/* Additional Menu Items */}
        <DrawerItem
          label="Quick Check-in"
          icon={({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('EmotionEntry');
          }}
        />
        
        <DrawerItem
          label="Resources"
          icon={({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Resources');
          }}
        />
        
        <DrawerItem
          label="Mood History"
          icon={({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('MoodHistory');
          }}
        />
        
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Settings');
          }}
        />
        
        <DrawerItem
          label="Help & Support"
          icon={({ color, size }) => (
            <Icon name="help-circle" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Help');
          }}
        />
      </DrawerContentScrollView>

      <Divider style={styles.divider} />

      {/* Footer Section */}
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Icon name="logout" size={size} color="#F44336" />
          )}
          onPress={handleLogout}
          labelStyle={styles.logoutLabel}
        />
        
        <View style={styles.appInfo}>
          <Caption style={styles.appVersion}>Emotion Tracker v1.0.0</Caption>
          <Caption style={styles.copyright}>© 2024 All rights reserved</Caption>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  avatarLabel: {
    color: '#6200ee',
    fontSize: 28,
    fontWeight: 'bold',
  },
  username: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userType: {
    color: '#E1BEE7',
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  streakItem: {
    alignItems: 'center',
  },
  streakNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: '#E1BEE7',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  drawerContent: {
    flex: 1,
  },
  footer: {
    paddingBottom: 20,
  },
  logoutLabel: {
    color: '#F44336',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  appVersion: {
    fontSize: 12,
    color: '#666',
  },
  copyright: {
    fontSize: 10,
    color: '#999',
  },
});

export default CustomDrawerContent;
