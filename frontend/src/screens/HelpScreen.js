import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Button,
  Text,
} from 'react-native-paper';

const HelpScreen = () => {
  const handleCallSupport = () => {
    Linking.openURL('tel:1-800-PPD-MOMS');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@emotiontracker.app');
  };

  const handleCrisisLine = () => {
    Linking.openURL('tel:988');
  };

  const handleTextCrisis = () => {
    Linking.openURL('sms:741741?body=HOME');
  };

  const faqs = [
    {
      question: 'How often should I check in?',
      answer: 'We recommend daily check-ins to build consistent tracking habits, but you can check in as often as you feel is helpful for your journey.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Yes! All your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.'
    },
    {
      question: 'What do the risk levels mean?',
      answer: 'Risk levels help identify when you might need additional support: Low (doing well), Moderate (consider self-care), High (consider professional support).'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your mood history from the Settings screen. This feature allows you to download your data as a CSV file.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'You can delete your account from the Profile screen. Please note this action is permanent and cannot be undone.'
    },
    {
      question: 'Is this app a substitute for medical care?',
      answer: 'No, this app is a supportive tool for tracking emotions and wellbeing. It should not replace professional medical care or therapy.'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using the app',
      icon: 'book-open-variant'
    },
    {
      title: 'Understanding Your Moods',
      description: 'How to interpret mood patterns',
      icon: 'brain'
    },
    {
      title: 'Setting Reminders',
      description: 'Never miss a daily check-in',
      icon: 'bell'
    },
    {
      title: 'Reading Your Statistics',
      description: 'Making sense of your progress',
      icon: 'chart-line'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>Help & Support</Title>
            <Paragraph style={styles.headerDescription}>
              We're here to support you on your emotional wellbeing journey.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Emergency Support */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <Title style={styles.emergencyTitle}>🚨 Need Immediate Help?</Title>
            <Paragraph style={styles.emergencyText}>
              If you're having thoughts of harming yourself or others, please reach out immediately.
            </Paragraph>
            <View style={styles.emergencyButtons}>
              <Button
                mode="contained"
                onPress={handleCrisisLine}
                style={styles.emergencyButton}
                buttonColor="#F44336"
              >
                Call 988
              </Button>
              <Button
                mode="outlined"
                onPress={handleTextCrisis}
                style={styles.emergencyButton}
                textColor="#F44336"
              >
                Text HOME to 741741
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Support */}
        <Card style={styles.contactCard}>
          <Card.Content>
            <Title>Contact Support</Title>
            <List.Item
              title="Email Support"
              description="support@emotiontracker.app"
              left={(props) => <List.Icon {...props} icon="email" />}
              onPress={handleEmailSupport}
            />
            <Divider />
            <List.Item
              title="Phone Support"
              description="1-800-PPD-MOMS"
              left={(props) => <List.Icon {...props} icon="phone" />}
              onPress={handleCallSupport}
            />
            <Divider />
            <List.Item
              title="Response Time"
              description="Usually within 24 hours"
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
          </Card.Content>
        </Card>

        {/* Tutorials */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Tutorials & Guides</Title>
            {tutorials.map((tutorial, index) => (
              <View key={index}>
                <List.Item
                  title={tutorial.title}
                  description={tutorial.description}
                  left={(props) => <List.Icon {...props} icon={tutorial.icon} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => alert(`${tutorial.title}\n\n${tutorial.description}\n\nThis tutorial will be available in the next update.`)}
                />
                {index < tutorials.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* FAQs */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Frequently Asked Questions</Title>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                {index < faqs.length - 1 && <Divider style={styles.faqDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Additional Resources */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Additional Resources</Title>
            <List.Item
              title="Community Forum"
              description="Connect with other users"
              left={(props) => <List.Icon {...props} icon="account-group" />}
              onPress={() => alert('Community forum coming soon!')}
            />
            <Divider />
            <List.Item
              title="Video Library"
              description="Educational videos and exercises"
              left={(props) => <List.Icon {...props} icon="video" />}
              onPress={() => alert('Video library coming soon!')}
            />
            <Divider />
            <List.Item
              title="Professional Directory"
              description="Find mental health professionals"
              left={(props) => <List.Icon {...props} icon="doctor" />}
              onPress={() => alert('Professional directory coming soon!')}
            />
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>App Information</Title>
            <Paragraph style={styles.infoText}>
              <Text style={styles.infoLabel}>Version:</Text> 1.0.0{'\n'}
              <Text style={styles.infoLabel}>Last Updated:</Text> February 2024{'\n'}
              <Text style={styles.infoLabel}>Platform:</Text> iOS & Android
            </Paragraph>
            <Button
              mode="text"
              onPress={() => alert('Check the app store for updates!')}
              style={styles.updateButton}
            >
              Check for Updates
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#E8F5E8',
  },
  headerTitle: {
    textAlign: 'center',
    color: '#2E7D32',
  },
  headerDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  emergencyCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#FFEBEE',
  },
  emergencyTitle: {
    color: '#C62828',
    textAlign: 'center',
  },
  emergencyText: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
  },
  contactCard: {
    marginBottom: 20,
    elevation: 4,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  faqItem: {
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  faqDivider: {
    marginTop: 12,
  },
  infoCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#F3E5F5',
  },
  infoText: {
    lineHeight: 24,
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  updateButton: {
    alignSelf: 'center',
  },
});

export default HelpScreen;
