import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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

const ResourcesScreen = () => {
  const resources = [
    {
      title: 'Understanding Postpartum Depression',
      description: 'Learn about symptoms, causes, and treatment options',
      icon: 'book-open-variant',
      type: 'article'
    },
    {
      title: 'Coping Strategies',
      description: 'Practical techniques for managing difficult emotions',
      icon: 'brain',
      type: 'guide'
    },
    {
      title: 'Support Groups',
      description: 'Connect with others who understand your journey',
      icon: 'account-group',
      type: 'community'
    },
    {
      title: 'Professional Help',
      description: 'When and how to seek professional support',
      icon: 'doctor',
      type: 'professional'
    },
    {
      title: 'Self-Care Activities',
      description: 'Gentle activities to support your wellbeing',
      icon: 'spa',
      type: 'activities'
    },
    {
      title: 'Emergency Resources',
      description: '24/7 crisis support and helplines',
      icon: 'phone',
      type: 'emergency'
    }
  ];

  const handleResourcePress = (resource) => {
    if (resource.type === 'emergency') {
      alert('Emergency Helpline: 1-800-PPD-MOMS\nCrisis Text Line: Text HOME to 741741');
    } else {
      alert(`${resource.title}\n\n${resource.description}\n\nThis resource will be available in the next update.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>Resources & Support</Title>
            <Paragraph style={styles.headerDescription}>
              Find helpful information, support options, and self-care resources for your emotional wellbeing journey.
            </Paragraph>
          </Card.Content>
        </Card>

        {resources.map((resource, index) => (
          <Card key={index} style={styles.resourceCard}>
            <List.Item
              title={resource.title}
              description={resource.description}
              left={(props) => <List.Icon {...props} icon={resource.icon} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => handleResourcePress(resource)}
              style={styles.listItem}
            />
            {index < resources.length - 1 && <Divider />}
          </Card>
        ))}

        <Card style={styles.tipCard}>
          <Card.Content>
            <Title style={styles.tipTitle}>💡 Daily Tip</Title>
            <Paragraph style={styles.tipText}>
              Remember to be kind to yourself. Healing is not linear, and every small step forward is progress.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.contactCard}>
          <Card.Content>
            <Title>Need Immediate Help?</Title>
            <Paragraph style={styles.contactText}>
              If you're having thoughts of harming yourself or others, please reach out immediately.
            </Paragraph>
            <Button
              mode="contained"
              onPress={() => alert('Calling 988 - Suicide & Crisis Lifeline')}
              style={styles.emergencyButton}
              buttonColor="#F44336"
            >
              Call 988
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
    color: '#2E7D32',
    textAlign: 'center',
  },
  headerDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  resourceCard: {
    marginBottom: 2,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 8,
  },
  tipCard: {
    marginVertical: 20,
    elevation: 4,
    backgroundColor: '#FFF3E0',
  },
  tipTitle: {
    color: '#E65100',
  },
  tipText: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  contactCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#FFEBEE',
  },
  contactText: {
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyButton: {
    marginTop: 8,
  },
});

export default ResourcesScreen;
