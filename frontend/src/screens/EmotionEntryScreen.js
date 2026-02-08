import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  TextInput,
  Chip,
  Divider,
} from 'react-native-paper';
import { emotionAPI } from '../api/api';

const EmotionEntryScreen = ({ navigation }) => {
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
  const [recommendations, setRecommendations] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const moods = [
    { key: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
    { key: 'sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
    { key: 'angry', label: 'Angry', emoji: '😠', color: '#F44336' },
    { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF9800' },
    { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#9E9E9E' },
  ];

  const handleMoodSelect = (mood) => {
    setFormData(prev => ({ ...prev, mood }));
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (daysOffset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysOffset);
    setFormData(prev => ({ ...prev, date: newDate }));
    setShowDatePicker(false);
  };

  const validateForm = () => {
    if (!formData.mood) {
      Alert.alert('Error', 'Please select your mood');
      return false;
    }
    if (!formData.sleep_hours || formData.sleep_hours <= 0 || formData.sleep_hours > 24) {
      Alert.alert('Error', 'Please enter valid sleep hours (0-24)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const entryData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        sleep_hours: parseFloat(formData.sleep_hours),
      };

      const response = await emotionAPI.createEntry(entryData);
      
      if (response.recommendations) {
        setRecommendations(response.recommendations);
      }

      Alert.alert(
        'Success!',
        'Your emotion entry has been recorded successfully.',
        [
          {
            text: 'View Recommendations',
            onPress: () => {
              if (response.recommendations && response.recommendations.length > 0) {
                showRecommendations(response.recommendations);
              }
              navigation.goBack();
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showRecommendations = (recs) => {
    const recommendationsText = recs.map((rec, index) => `${index + 1}. ${rec}`).join('\n\n');
    Alert.alert(
      'Your Personalized Recommendations',
      recommendationsText,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderSlider = (title, field, min, max, labels) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderTitle}>{title}</Text>
      <View style={styles.sliderButtons}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((value) => (
          <Chip
            key={value}
            style={[
              styles.sliderChip,
              formData[field] === value && styles.sliderChipSelected,
            ]}
            textStyle={[
              styles.sliderChipText,
              formData[field] === value && styles.sliderChipTextSelected,
            ]}
            onPress={() => handleSliderChange(field, value)}
          >
            {value}
          </Chip>
        ))}
      </View>
      <View style={styles.sliderLabels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.sliderLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>How are you feeling today?</Title>
            <Paragraph>
              Take a moment to check in with your emotions. This helps you track your wellbeing journey.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Mood Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Current Mood</Title>
            <View style={styles.moodContainer}>
              {moods.map((mood) => (
                <Chip
                  key={mood.key}
                  style={[
                    styles.moodChip,
                    formData.mood === mood.key && {
                      backgroundColor: mood.color,
                    },
                  ]}
                  textStyle={[
                    styles.moodChipText,
                    formData.mood === mood.key && { color: 'white' },
                  ]}
                  onPress={() => handleMoodSelect(mood.key)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Anxiety Level */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Anxiety Level</Title>
            {renderSlider(
              'How anxious are you feeling?',
              'anxiety_level',
              1,
              5,
              ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
            )}
          </Card.Content>
        </Card>

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

        {/* Energy Level */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Energy Level</Title>
            {renderSlider(
              'What is your energy level?',
              'energy_level',
              1,
              5,
              ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
            )}
          </Card.Content>
        </Card>

        {/* Appetite */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Appetite</Title>
            {renderSlider(
              'How is your appetite today?',
              'appetite',
              1,
              5,
              ['Very Poor', 'Poor', 'Normal', 'Good', 'Very Good']
            )}
          </Card.Content>
        </Card>

        {/* Journal */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Journal (Optional)</Title>
            <Paragraph style={styles.journalHint}>
              Share any thoughts or feelings you'd like to remember...
            </Paragraph>
            <TextInput
              label="Your thoughts"
              value={formData.journal_text}
              onChangeText={(value) => setFormData(prev => ({ ...prev, journal_text: value }))}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.textInput}
              placeholder="How was your day? Anything on your mind?"
            />
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </Button>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            This app is not a medical diagnostic tool. If you're experiencing severe symptoms,
            please consult a healthcare professional.
          </Text>
        </View>
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
  cardTitle: {
    textAlign: 'center',
    color: '#6200ee',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moodChipText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    marginVertical: 8,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  sliderChip: {
    backgroundColor: '#f0f0f0',
  },
  sliderChipSelected: {
    backgroundColor: '#6200ee',
  },
  sliderChipText: {
    color: '#666',
  },
  sliderChipTextSelected: {
    color: 'white',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  dateButton: {
    marginTop: 8,
  },
  textInput: {
    marginTop: 8,
  },
  journalHint: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  disclaimerContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 16,
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

export default EmotionEntryScreen;
