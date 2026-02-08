import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../api/api';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    age: '',
    delivery_date: '',
    support_system: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 100)) {
      newErrors.age = 'Please enter a valid age (13-100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        delivery_date: formData.delivery_date || null,
      };

      const response = await authAPI.register(userData);
      
      // Store tokens
      await AsyncStorage.setItem('userToken', response.tokens.access);
      await AsyncStorage.setItem('refreshToken', response.tokens.refresh);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      
      // Navigate to Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      const errorData = error.response?.data;
      if (typeof errorData === 'object') {
        // Handle field-specific errors
        const apiErrors = {};
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            apiErrors[key] = errorData[key][0];
          } else {
            apiErrors[key] = errorData[key];
          }
        });
        setErrors(apiErrors);
      } else {
        Alert.alert(
          'Registration Failed',
          errorData?.detail || 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Create Account</Title>
              <Paragraph style={styles.subtitle}>
                Start your emotional wellbeing journey
              </Paragraph>

              <TextInput
                label="Username"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                error={!!errors.username}
                disabled={loading}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                label="Confirm Password"
                value={formData.password_confirm}
                onChangeText={(value) => handleInputChange('password_confirm', value)}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                error={!!errors.password_confirm}
                disabled={loading}
              />
              {errors.password_confirm && (
                <Text style={styles.errorText}>{errors.password_confirm}</Text>
              )}

              <TextInput
                label="Age (Optional)"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.age}
                disabled={loading}
              />
              {errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}

              <TextInput
                label="Delivery Date (Optional)"
                value={formData.delivery_date}
                onChangeText={(value) => handleInputChange('delivery_date', value)}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY-MM-DD"
                error={!!errors.delivery_date}
                disabled={loading}
              />
              {errors.delivery_date && (
                <Text style={styles.errorText}>{errors.delivery_date}</Text>
              )}

              <TextInput
                label="Support System (Optional)"
                value={formData.support_system}
                onChangeText={(value) => handleInputChange('support_system', value)}
                mode="outlined"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                error={!!errors.support_system}
                disabled={loading}
              />
              {errors.support_system && (
                <Text style={styles.errorText}>{errors.support_system}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Create Account
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
                style={styles.linkButton}
              >
                Already have an account? Sign In
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: 20,
    paddingTop: 40,
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
    marginBottom: 8,
  },
  textArea: {
    minHeight: 80,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 15,
  },
});

export default RegisterScreen;
