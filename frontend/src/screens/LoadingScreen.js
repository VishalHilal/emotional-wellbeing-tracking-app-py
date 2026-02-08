import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const LoadingScreen = () => {
  const containerStyle = Platform.OS === 'web' 
    ? [styles.container, { background: 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)' }]
    : styles.container;

  if (Platform.OS === 'web') {
    return (
      <View style={containerStyle}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#7F00FF" />
          <Text style={styles.text}>Loading, please wait...</Text>
          <Text style={styles.subText}>Fetching your data</Text>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#7F00FF', '#E100FF']}
      style={styles.container}
    >
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#7F00FF" />
        <Text style={styles.text}>Loading, please wait...</Text>
        <Text style={styles.subText}>Fetching your data</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.75,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 8,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    } : {
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 10,
    }),
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    marginTop: 6,
    fontSize: 14,
    color: '#888',
  },
});

export default LoadingScreen;
