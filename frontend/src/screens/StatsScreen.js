import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Chip,
  Button,
  DataTable,
} from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { emotionAPI } from '../api/api';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    const s = await emotionAPI.getStats(timeRange);
    const e = await emotionAPI.getEntries(timeRange);
    setStats(s);
    setEntries(e);
    setLoading(false);
  };

  const getMoodColor = (mood) => ({
    happy: '#4CAF50',
    sad: '#2196F3',
    angry: '#F44336',
    anxious: '#FF9800',
    neutral: '#9E9E9E',
  }[mood] || '#9E9E9E');

  const getRiskColor = (risk) => ({
    low: '#4CAF50',
    moderate: '#FF9800',
    high: '#F44336',
  }[risk] || '#9E9E9E');

  const moodData = stats?.mood_distribution
    ? Object.entries(stats.mood_distribution).map(([key, val]) => ({
        name: key,
        population: val,
        color: getMoodColor(key),
        legendFontColor: '#333',
        legendFontSize: 12,
      }))
    : [];

  const riskTrend = stats?.risk_trend || [];

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
    labelColor: () => '#333',
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text>Loading Stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <Text style={styles.header}>📊 Emotion Analytics</Text>

      {/* Time Filter */}
      <View style={styles.chipRow}>
        {[7, 30, 90].map((day) => (
          <Chip
            key={day}
            selected={timeRange === day}
            onPress={() => setTimeRange(day)}
            style={[
              styles.chip,
              timeRange === day && styles.chipActive,
            ]}
            textStyle={{ color: timeRange === day ? '#fff' : '#333' }}
          >
            {day === 7 ? '1W' : day === 30 ? '1M' : '3M'}
          </Chip>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.grid}>
        {renderStat('Anxiety', stats.avg_anxiety)}
        {renderStat('Sleep (hrs)', stats.avg_sleep)}
        {renderStat('Energy', stats.avg_energy)}
        {renderStat('Appetite', stats.avg_appetite)}
      </View>

      {/* Mood Chart */}
      {moodData.length > 0 && (
        <Card style={styles.card}>
          <Title>Mood Distribution</Title>
          <PieChart
            data={moodData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </Card>
      )}

      {/* Risk Trend */}
      {riskTrend.length > 0 && (
        <Card style={styles.card}>
          <Title>Risk Trend</Title>
          <LineChart
            data={{
              labels: riskTrend.map(i =>
                new Date(i.date).toLocaleDateString('en', { day: 'numeric', month: 'short' })
              ),
              datasets: [{ data: riskTrend.map(i => i.risk_score * 100) }],
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </Card>
      )}

      {/* Recent Entries */}
      <Card style={styles.card}>
        <Title>Recent Entries</Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Mood</DataTable.Title>
            <DataTable.Title numeric>Risk</DataTable.Title>
          </DataTable.Header>

          {entries.slice(0, 8).map((e) => (
            <DataTable.Row key={e.id}>
              <DataTable.Cell>
                {new Date(e.date).toLocaleDateString()}
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip style={{ backgroundColor: getMoodColor(e.mood) }} textStyle={{ color: '#fff' }}>
                  {e.mood}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Chip style={{ backgroundColor: getRiskColor(e.risk_category) }} textStyle={{ color: '#fff' }}>
                  {e.risk_category || '-'}
                </Chip>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>

      {/* Insights */}
      <Card style={styles.card}>
        <Title>Insights</Title>
        <Text style={styles.insight}>📌 Entries: {stats.entries_count}</Text>
        {stats.avg_sleep < 6 && <Text>💤 Improve sleep habits</Text>}
        {stats.avg_anxiety > 3 && <Text>😰 Try breathing exercises</Text>}
        {stats.avg_energy < 3 && <Text>🔋 Light workout recommended</Text>}
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('EmotionEntry')}
        style={styles.button}
      >
        Log New Entry
      </Button>

    </ScrollView>
  );
};

const renderStat = (label, value) => (
  <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.statCard}>
    <Text style={styles.statValue}>{value?.toFixed(1) || 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </LinearGradient>
);

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chip: {
    marginHorizontal: 6,
    backgroundColor: '#eee',
  },
  chipActive: {
    backgroundColor: '#6366F1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    marginTop: 4,
  },
  card: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 4,
  },
  insight: {
    marginVertical: 4,
  },
  button: {
    marginVertical: 20,
    borderRadius: 12,
    paddingVertical: 6,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
