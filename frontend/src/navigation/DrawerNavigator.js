import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'react-native-paper';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import EmotionEntryScreen from '../screens/EmotionEntryScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#6200ee',
        drawerInactiveTintColor: '#666',
        drawerActiveBackgroundColor: '#E8EAF6',
        drawerInactiveBackgroundColor: 'transparent',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        swipeEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="EmotionEntry"
        component={EmotionEntryScreen}
        options={{
          title: 'Daily Check-in',
          drawerIcon: ({ color, size }) => (
            <Icon name="emoticon-happy" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Statistics',
          drawerIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          title: 'Resources',
          drawerIcon: ({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MoodHistory"
        component={MoodHistoryScreen}
        options={{
          title: 'Mood History',
          drawerIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Help & Support',
          drawerIcon: ({ color, size }) => (
            <Icon name="help-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
