import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../api/api';

<<<<<<< HEAD
const LoginScreen = () => {
=======
const LoginScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

<<<<<<< HEAD
>>>>>>> f9f3bfd3e67dfaec0765b84c2f14f1f2c01852e2
=======
>>>>>>> f9f3bfd3e67dfaec0765b84c2f14f1f2c01852e2
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(username, password);

      await AsyncStorage.setItem('userToken', response.tokens.access);
      await AsyncStorage.setItem('refreshToken', response.tokens.refresh);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
<<<<<<< HEAD
<<<<<<< HEAD
      
      // Navigate to Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
=======
=======
>>>>>>> f9f3bfd3e67dfaec0765b84c2f14f1f2c01852e2

      setUserToken(response.tokens.access);
>>>>>>> f9f3bfd3e67dfaec0765b84c2f14f1f2c01852e2
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.detail || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[styles.card, { width: width > 600 ? 450 : '100%' }]}>
            <Card.Content>

              <Text style={styles.title}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>
                Track your emotional wellbeing journey
              </Text>

              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                disabled={loading}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                style={styles.linkButton}
              >
                Don’t have an account? Sign Up
              </Button>

            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    color: '#64748b',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 15,
  },
});
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              Don't have an account? Sign Up
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 8,
    color: '#6200ee',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 15,
  },
});

export default LoginScreen;
