import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Chip,
  Text,
  Searchbar,
} from 'react-native-paper';
import { emotionAPI } from '../api/api';

const MoodHistoryScreen = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockHistory = [
        {
          id: 1,
          date: '2024-02-08',
          mood: 'happy',
          intensity: 7,
          notes: 'Had a good day with family',
          risk_category: 'low',
          triggers: ['family_time', 'exercise'],
        },
        {
          id: 2,
          date: '2024-02-07',
          mood: 'anxious',
          intensity: 6,
          notes: 'Feeling overwhelmed with responsibilities',
          risk_category: 'moderate',
          triggers: ['stress', 'lack_of_sleep'],
        },
        {
          id: 3,
          date: '2024-02-06',
          mood: 'neutral',
          intensity: 5,
          notes: 'Just an okay day',
          risk_category: 'low',
          triggers: [],
        },
        {
          id: 4,
          date: '2024-02-05',
          mood: 'sad',
          intensity: 8,
          notes: 'Missing my old routine',
          risk_category: 'moderate',
          triggers: ['loneliness', 'hormonal_changes'],
        },
        {
          id: 5,
          date: '2024-02-04',
          mood: 'happy',
          intensity: 8,
          notes: 'Baby smiled at me today!',
          risk_category: 'low',
          triggers: ['baby_milestones', 'partner_support'],
        },
      ];
      setMoodHistory(mockHistory);
    } catch (error) {
      console.error('Error loading mood history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMoodHistory();
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

  const getMoodColor = (mood) => {
    const moodColors = {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#FF5722',
      anxious: '#FF9800',
      neutral: '#9E9E9E',
    };
    return moodColors[mood] || '#9E9E9E';
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

  const filteredHistory = moodHistory.filter(entry =>
    entry.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading mood history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Card style={styles.headerCard}>
            <Card.Content>
              <Title style={styles.headerTitle}>Mood History</Title>
              <Paragraph style={styles.headerDescription}>
                Track your emotional journey over time
              </Paragraph>
              <Searchbar
                placeholder="Search your mood entries..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />
            </Card.Content>
          </Card>

          {filteredHistory.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Title>No entries found</Title>
                <Paragraph>
                  {searchQuery ? 'Try adjusting your search terms' : 'Start tracking your moods to see your history here'}
                </Paragraph>
              </Card.Content>
            </Card>
          ) : (
            filteredHistory.map((entry, index) => (
              <Card key={entry.id} style={styles.entryCard}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <View style={styles.moodContainer}>
                      <Text style={styles.moodEmoji}>
                        {getMoodEmoji(entry.mood)}
                      </Text>
                      <View>
                        <Text style={styles.moodText}>
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </Text>
                        <Text style={styles.dateText}>
                          {new Date(entry.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.intensityContainer}>
                      <Text style={styles.intensityText}>
                        Intensity: {entry.intensity}/10
                      </Text>
                      <Chip
                        style={[
                          styles.riskChip,
                          { backgroundColor: getRiskColor(entry.risk_category) }
                        ]}
                        textStyle={{ color: 'white' }}
                      >
                        {entry.risk_category.toUpperCase()}
                      </Chip>
                    </View>
                  </View>

                  {entry.notes && (
                    <Paragraph style={styles.notesText}>
                      {entry.notes}
                    </Paragraph>
                  )}

                  {entry.triggers && entry.triggers.length > 0 && (
                    <View style={styles.triggersContainer}>
                      <Text style={styles.triggersTitle}>Triggers:</Text>
                      <View style={styles.chipsContainer}>
                        {entry.triggers.map((trigger, triggerIndex) => (
                          <Chip
                            key={triggerIndex}
                            style={styles.triggerChip}
                            compact
                          >
                            {trigger.replace('_', ' ')}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 20,
    elevation: 4,
  },
  headerTitle: {
    textAlign: 'center',
    color: '#6200ee',
  },
  headerDescription: {
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    marginTop: 8,
  },
  emptyCard: {
    elevation: 4,
    textAlign: 'center',
  },
  entryCard: {
    marginBottom: 12,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  intensityContainer: {
    alignItems: 'flex-end',
  },
  intensityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  riskChip: {
    alignSelf: 'flex-end',
  },
  notesText: {
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  triggersContainer: {
    marginTop: 8,
  },
  triggersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#666',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  triggerChip: {
    backgroundColor: '#E1F5FE',
  },
});

export default MoodHistoryScreen;
