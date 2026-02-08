import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  TextInput,
  Chip,
} from 'react-native-paper';
import { emotionAPI } from '../api/api';

const EmotionEntryScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();

  const [formData, setFormData] = useState({
    mood: '',
    anxiety_level: 3,
    sleep_hours: '',
    energy_level: 3,
    appetite: 3,
    journal_text: '',
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const moods = [
    { key: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
    { key: 'sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
    { key: 'angry', label: 'Angry', emoji: '😠', color: '#F44336' },
    { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF9800' },
    { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#9E9E9E' },
  ];

  const handleDateSelect = (daysOffset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysOffset);
    setFormData(prev => ({ ...prev, date: newDate }));
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!formData.mood) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }
    if (!formData.sleep_hours || formData.sleep_hours <= 0 || formData.sleep_hours > 24) {
      Alert.alert('Error', 'Enter valid sleep hours (1-24)');
      return;
    }

    setLoading(true);
    try {
      const entryData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        sleep_hours: parseFloat(formData.sleep_hours),
      };

      await emotionAPI.createEntry(entryData);

      Alert.alert('Success', 'Your emotion entry has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const renderScale = (title, field, labels) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{title}</Title>
        <View style={styles.scaleRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Chip
              key={value}
              style={[
                styles.scaleChip,
                formData[field] === value && styles.scaleChipActive,
              ]}
              textStyle={{
                color: formData[field] === value ? '#fff' : '#555',
              }}
              onPress={() =>
                setFormData((prev) => ({ ...prev, [field]: value }))
              }
            >
              {value}
            </Chip>
          ))}
        </View>
        <View style={styles.scaleLabels}>
          {labels.map((label, i) => (
            <Text key={i} style={styles.scaleLabel}>
              {label}
            </Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: width > 600 ? 32 : 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>How are you feeling today?</Title>
        <Paragraph style={styles.headerSubtitle}>
          Track your emotions & improve your wellbeing 🌱
        </Paragraph>
      </View>

      {/* Mood */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Your Mood</Title>
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <Chip
                key={mood.key}
                style={[
                  styles.moodChip,
                  formData.mood === mood.key && {
                    backgroundColor: mood.color,
                  },
                ]}
                textStyle={{
                  color: formData.mood === mood.key ? '#fff' : '#333',
                }}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, mood: mood.key }))
                }
              >
                {mood.emoji} {mood.label}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {renderScale('Anxiety Level', 'anxiety_level', [
        'Very Low',
        'Low',
        'Moderate',
        'High',
        'Very High',
      ])}

      {/* Date Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Date</Title>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {formData.date.toLocaleDateString()}
          </Button>
        </Card.Content>
      </Card>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>Select Date</Title>
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => handleDateSelect(0)}
            >
              <Text style={styles.dateOptionText}>Today</Text>
              <Text style={styles.dateOptionSubtext}>
                {new Date().toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => handleDateSelect(-1)}
            >
              <Text style={styles.dateOptionText}>Yesterday</Text>
              <Text style={styles.dateOptionSubtext}>
                {new Date(Date.now() - 86400000).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => handleDateSelect(-2)}
            >
              <Text style={styles.dateOptionText}>2 Days Ago</Text>
              <Text style={styles.dateOptionSubtext}>
                {new Date(Date.now() - 172800000).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => handleDateSelect(-3)}
            >
              <Text style={styles.dateOptionText}>3 Days Ago</Text>
              <Text style={styles.dateOptionSubtext}>
                {new Date(Date.now() - 259200000).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => handleDateSelect(-7)}
            >
              <Text style={styles.dateOptionText}>1 Week Ago</Text>
              <Text style={styles.dateOptionSubtext}>
                {new Date(Date.now() - 604800000).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Sleep Hours */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Sleep</Title>
          <TextInput
            label="Hours of sleep last night"
            value={formData.sleep_hours}
            onChangeText={(value) => setFormData(prev => ({ ...prev, sleep_hours: value }))}
            mode="outlined"
            keyboardType="numeric"
            placeholder="e.g., 7.5"
            style={styles.textInput}
          />
        </Card.Content>
      </Card>

      {renderScale('Energy Level', 'energy_level', [
        'Very Low',
        'Low',
        'Moderate',
        'High',
        'Very High',
      ])}

      {renderScale('Appetite', 'appetite', [
        'Very Poor',
        'Poor',
        'Normal',
        'Good',
        'Very Good',
      ])}

      {/* Journal */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Journal</Title>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Write your thoughts..."
            value={formData.journal_text}
            onChangeText={(v) =>
              setFormData((prev) => ({ ...prev, journal_text: v }))
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 12 }}
      >
        Save Entry
      </Button>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          This app is not a medical diagnostic tool. Please consult a professional
          if symptoms persist.
        </Text>
      </View>
    </ScrollView>
  );
};

export default EmotionEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A148C',
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodChip: {
    width: '48%',
    marginBottom: 10,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleChip: {
    backgroundColor: '#EEE',
    width: 48,
    justifyContent: 'center',
  },
  scaleChipActive: {
    backgroundColor: '#6200EE',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    flex: 1,
  },
  dateButton: {
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: '#6200EE',
  },
  disclaimer: {
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#E65100',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee',
  },
  dateOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateOptionSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 15,
  },
});
