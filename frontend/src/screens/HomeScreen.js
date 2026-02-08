import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
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

const { width } = Dimensions.get('window');

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
    const userDataStr = await AsyncStorage.getItem('userData');
    if (userDataStr) setUserData(JSON.parse(userDataStr));
  };

  const loadDashboardData = async () => {
    try {
      const data = await emotionAPI.getDashboardSummary();
      setDashboardData(data);
    } catch (error) {
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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
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

  const getRiskColor = (risk) => {
    switch (risk) {
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

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text variant="titleLarge">Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card style={styles.headerCard}>
          <Title style={styles.headerTitle}>
            Hello, {userData?.username || 'User'} 👋
          </Title>
          <Paragraph style={styles.subtitle}>
            Track your emotional health today
          </Paragraph>
        </Card>

        {dashboardData?.today_entry ? (
          <Card style={styles.mainCard}>
            <Title>Today's Mood</Title>
            <View style={styles.moodRow}>
              <Text style={styles.emoji}>
                {getMoodEmoji(dashboardData.today_entry.mood)}
              </Text>
              <Text style={styles.moodText}>
                {dashboardData.today_entry.mood}
              </Text>
            </View>

            <Chip
              style={[
                styles.riskChip,
                { backgroundColor: getRiskColor(dashboardData.today_entry.risk_category) },
              ]}
              textStyle={{ color: '#fff' }}
            >
              {dashboardData.today_entry.risk_category.toUpperCase()} RISK
            </Chip>
          </Card>
        ) : (
          <Card style={styles.mainCardAlt}>
            <Title>No Check-in Today</Title>
            <Paragraph>Log how you're feeling now.</Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EmotionEntry')}
              style={styles.btn}
            >
              Check In
            </Button>
          </Card>
        )}

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboardData?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dashboardData?.week_moods?.length || 0}
            </Text>
            <Text style={styles.statLabel}>This Week</Text>
          </Card>
        </View>

        {dashboardData?.recent_assessment && (
          <Card style={styles.assessmentCard}>
            <Title>Latest Assessment</Title>
            <View style={styles.assessmentRow}>
              <Chip
                style={[
                  styles.assessmentChip,
                  { backgroundColor: getRiskColor(dashboardData.recent_assessment.risk_category) },
                ]}
                textStyle={{ color: '#fff' }}
              >
                {dashboardData.recent_assessment.risk_category.toUpperCase()}
              </Chip>
              <Text style={styles.score}>
                {(dashboardData.recent_assessment.risk_score * 100).toFixed(1)}%
              </Text>
            </View>

            {dashboardData.recent_assessment.recommendations
              .slice(0, 3)
              .map((rec, i) => (
                <Text key={i} style={styles.recommendation}>
                  • {rec}
                </Text>
              ))}
          </Card>
        )}

        <Card style={styles.actionCard}>
          <List.Item title="Statistics" left={() => <List.Icon icon="chart-line" />} onPress={() => navigation.navigate('Stats')} />
          <Divider />
          <List.Item title="Profile" left={() => <List.Icon icon="account" />} onPress={() => navigation.navigate('Profile')} />
          <Divider />
          <List.Item title="Logout" left={() => <List.Icon icon="logout" />} onPress={handleLogout} />
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>

      {!dashboardData?.today_entry && (
        <FAB
          icon="plus"
          label="Check In"
          style={styles.fab}
          onPress={() => navigation.navigate('EmotionEntry')}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5FA' },

  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  appbar: { backgroundColor: '#6200ee' },

  headerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
  },

  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: '#eee', marginTop: 4 },

  mainCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
  },

  mainCardAlt: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
  },

  moodRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  emoji: { fontSize: 48, marginRight: 12 },
  moodText: { fontSize: 20, fontWeight: 'bold' },

  riskChip: { alignSelf: 'flex-start' },

  btn: { marginTop: 12 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },

  statCard: {
    width: width / 2.3,
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
  },

  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#6C63FF' },
  statLabel: { color: '#666' },

  assessmentCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
  },

  assessmentRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  assessmentChip: { marginRight: 10 },
  score: { fontSize: 18, fontWeight: 'bold' },

  recommendation: { color: '#555', marginVertical: 2 },

  actionCard: {
    marginHorizontal: 16,
    borderRadius: 20,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6C63FF',
  },
});
