import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Chip,
  Button,
  DataTable,
} from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { emotionAPI } from '../api/api';

const { width: screenWidth } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadStats();
    loadEntries();
  }, [timeRange]);

  const loadStats = async () => {
    try {
      const data = await emotionAPI.getStats(timeRange);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadEntries = async () => {
    try {
      const data = await emotionAPI.getEntries(timeRange);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#F44336',
      anxious: '#FF9800',
      neutral: '#9E9E9E',
    };
    return colors[mood] || '#9E9E9E';
  };

  const getRiskColor = (category) => {
    switch (category) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const prepareMoodDistribution = () => {
    if (!stats?.mood_distribution) return [];
    
    return Object.entries(stats.mood_distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      population: count,
      color: getMoodColor(mood),
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
  };

  const prepareRiskTrend = () => {
    if (!stats?.risk_trend) return { labels: [], datasets: [] };
    
    const labels = stats.risk_trend.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    });
    
    const data = stats.risk_trend.map(item => (item.risk_score * 100).toFixed(1));
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6200ee',
    },
  };

  const pieChartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Time Range Selector */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Time Range</Title>
            <View style={styles.timeRangeContainer}>
              {[7, 30, 90].map((days) => (
                <Chip
                  key={days}
                  style={[
                    styles.timeChip,
                    timeRange === days && styles.timeChipSelected,
                  ]}
                  textStyle={[
                    styles.timeChipText,
                    timeRange === days && styles.timeChipTextSelected,
                  ]}
                  onPress={() => setTimeRange(days)}
                >
                  {days === 7 ? '1 Week' : days === 30 ? '1 Month' : '3 Months'}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Summary Statistics</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.avg_anxiety?.toFixed(1) || 0}</Text>
                <Text style={styles.statLabel}>Avg Anxiety</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.avg_sleep?.toFixed(1) || 0}</Text>
                <Text style={styles.statLabel}>Avg Sleep (hrs)</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.avg_energy?.toFixed(1) || 0}</Text>
                <Text style={styles.statLabel}>Avg Energy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.avg_appetite?.toFixed(1) || 0}</Text>
                <Text style={styles.statLabel}>Avg Appetite</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Mood Distribution */}
        {prepareMoodDistribution().length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Mood Distribution</Title>
              <PieChart
                data={prepareMoodDistribution()}
                width={screenWidth - 48}
                height={220}
                chartConfig={pieChartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 10]}
                absolute
              />
            </Card.Content>
          </Card>
        )}

        {/* Risk Trend */}
        {prepareRiskTrend().labels.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Risk Score Trend</Title>
              <LineChart
                data={prepareRiskTrend()}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        )}

        {/* Recent Entries */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Entries</Title>
            {entries.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title>Mood</DataTable.Title>
                  <DataTable.Title numeric>Risk</DataTable.Title>
                </DataTable.Header>

                {entries.slice(0, 10).map((entry) => (
                  <DataTable.Row key={entry.id}>
                    <DataTable.Cell>
                      {new Date(entry.date).toLocaleDateString()}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Chip
                        style={[
                          styles.moodChip,
                          { backgroundColor: getMoodColor(entry.mood) }
                        ]}
                        textStyle={{ color: 'white', fontSize: 12 }}
                      >
                        {entry.mood}
                      </Chip>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {entry.risk_category ? (
                        <Chip
                          style={[
                            styles.riskChip,
                            { backgroundColor: getRiskColor(entry.risk_category) }
                          ]}
                          textStyle={{ color: 'white', fontSize: 12 }}
                        >
                          {entry.risk_category}
                        </Chip>
                      ) : (
                        '-'
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <Paragraph>No entries found for this time period.</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Insights */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Insights</Title>
            {stats?.entries_count > 0 ? (
              <View>
                <Paragraph style={styles.insightText}>
                  You've logged {stats.entries_count} entries in the selected period.
                </Paragraph>
                {stats.avg_sleep < 6 && (
                  <Paragraph style={styles.insightText}>
                    💤 Your average sleep is below 6 hours. Consider prioritizing rest.
                  </Paragraph>
                )}
                {stats.avg_anxiety > 3 && (
                  <Paragraph style={styles.insightText}>
                    😰 Your anxiety levels are elevated. Try relaxation techniques.
                  </Paragraph>
                )}
                {stats.avg_energy < 3 && (
                  <Paragraph style={styles.insightText}>
                    🔋 Your energy levels are low. Gentle exercise might help.
                  </Paragraph>
                )}
              </View>
            ) : (
              <Paragraph>
                Start logging your emotions to see personalized insights here.
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Action Button */}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EmotionEntry')}
          style={styles.actionButton}
        >
          Log New Entry
        </Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  timeChip: {
    backgroundColor: '#f0f0f0',
  },
  timeChipSelected: {
    backgroundColor: '#6200ee',
  },
  timeChipText: {
    color: '#666',
  },
  timeChipTextSelected: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  moodChip: {
    height: 28,
  },
  riskChip: {
    height: 28,
  },
  insightText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default StatsScreen;
