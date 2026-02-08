import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  FAB,
  Chip,
  List,
  Divider,
  Appbar,
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emotionAPI } from '../api/api';

const HomeScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      loadUserData();
    }, [])
  );

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

  const loadDashboardData = async () => {
    try {
      const data = await emotionAPI.getDashboardSummary();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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
              // Navigate to Login screen
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

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      neutral: '😐',
    };
    return moodEmojis[mood] || '😐';
  };

  const getRiskColor = (riskCategory) => {
    switch (riskCategory) {
      case 'low':
        return '#4CAF50';
      case 'moderate':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getRiskMessage = (riskCategory) => {
    switch (riskCategory) {
      case 'low':
        return 'You\'re doing well! Keep up the good work.';
      case 'moderate':
        return 'Consider some self-care activities today.';
      case 'high':
        return 'Please consider reaching out for support.';
      default:
        return 'Complete your daily check-in to see your status.';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Header */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              Welcome back, {userData?.username || 'User'}! 👋
            </Title>
            <Paragraph>
              How are you feeling today? Take a moment to check in.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Today's Status */}
        {dashboardData?.today_entry ? (
          <Card style={styles.statusCard}>
            <Card.Content>
              <Title>Today's Check-in</Title>
              <View style={styles.moodContainer}>
                <Text style={styles.moodEmoji}>
                  {getMoodEmoji(dashboardData.today_entry.mood)}
                </Text>
                <Text style={styles.moodText}>
                  Feeling {dashboardData.today_entry.mood}
                </Text>
              </View>
              
              {dashboardData.today_entry.risk_category && (
                <View style={styles.riskContainer}>
                  <Chip
                    style={[
                      styles.riskChip,
                      { backgroundColor: getRiskColor(dashboardData.today_entry.risk_category) }
                    ]}
                    textStyle={{ color: 'white' }}
                  >
                    {dashboardData.today_entry.risk_category.toUpperCase()} RISK
                  </Chip>
                  <Text style={styles.riskMessage}>
                    {getRiskMessage(dashboardData.today_entry.risk_category)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.checkInCard}>
            <Card.Content>
              <Title>No check-in today yet</Title>
              <Paragraph>
                How are you feeling? Take a moment to record your emotions.
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('EmotionEntry')}
                style={styles.checkInButton}
              >
                Check In Now
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Streak */}
        <Card style={styles.streakCard}>
          <Card.Content>
            <View style={styles.streakContainer}>
              <View style={styles.streakItem}>
                <Text style={styles.streakNumber}>{dashboardData?.streak || 0}</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
              </View>
              <Divider style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakNumber}>
                  {dashboardData?.week_moods?.length || 0}
                </Text>
                <Text style={styles.streakLabel}>Entries This Week</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Risk Assessment */}
        {dashboardData?.recent_assessment && (
          <Card style={styles.assessmentCard}>
            <Card.Content>
              <Title>Latest Assessment</Title>
              <View style={styles.assessmentContainer}>
                <Chip
                  style={[
                    styles.assessmentChip,
                    { backgroundColor: getRiskColor(dashboardData.recent_assessment.risk_category) }
                  ]}
                  textStyle={{ color: 'white' }}
                >
                  {dashboardData.recent_assessment.risk_category.toUpperCase()}
                </Chip>
                <Text style={styles.assessmentScore}>
                  Risk Score: {(dashboardData.recent_assessment.risk_score * 100).toFixed(1)}%
                </Text>
              </View>
              
              {dashboardData.recent_assessment.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                  {dashboardData.recent_assessment.recommendations.slice(0, 3).map((rec, index) => (
                    <Text key={index} style={styles.recommendationItem}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <List.Item
              title="View Statistics"
              description="Track your emotional patterns"
              left={(props) => <List.Icon {...props} icon="chart-line" />}
              onPress={() => navigation.navigate('Stats')}
            />
            <List.Item
              title="Edit Profile"
              description="Update your information"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              onPress={() => navigation.navigate('Profile')}
            />
            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={(props) => <List.Icon {...props} icon="logout" />}
              onPress={handleLogout}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      {!dashboardData?.today_entry && (
        <FAB
          style={styles.fab}
          icon="plus"
          label="Check In"
          onPress={() => navigation.navigate('EmotionEntry')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appbar: {
    backgroundColor: '#6200ee',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#6200ee',
  },
  statusCard: {
    marginBottom: 16,
    elevation: 4,
  },
  checkInCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#E3F2FD',
  },
  checkInButton: {
    marginTop: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  moodEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  moodText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  riskContainer: {
    marginTop: 8,
  },
  riskChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  riskMessage: {
    fontStyle: 'italic',
    color: '#666',
  },
  streakCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#F3E5F5',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  assessmentCard: {
    marginBottom: 16,
    elevation: 4,
  },
  assessmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  assessmentChip: {
    marginRight: 12,
  },
  assessmentScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    marginTop: 12,
  },
  recommendationsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationItem: {
    color: '#666',
    marginBottom: 2,
  },
  actionsCard: {
    marginBottom: 80, // Extra space for FAB
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
