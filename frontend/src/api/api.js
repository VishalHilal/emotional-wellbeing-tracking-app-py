import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
      // You might want to navigate to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  },
};

// Emotion Tracking API
export const emotionAPI = {
  getEntries: async (days = 30) => {
    const response = await api.get(`/emotions/entries/?days=${days}`);
    return response.data;
  },

  createEntry: async (entryData) => {
    const response = await api.post('/emotions/entries/', entryData);
    return response.data;
  },

  updateEntry: async (entryId, entryData) => {
    const response = await api.put(`/emotions/entries/${entryId}/`, entryData);
    return response.data;
  },

  deleteEntry: async (entryId) => {
    await api.delete(`/emotions/entries/${entryId}/`);
  },

  getStats: async (days = 30) => {
    const response = await api.get(`/emotions/stats/?days=${days}`);
    return response.data;
  },

  getRiskAssessments: async (days = 30) => {
    const response = await api.get(`/emotions/risk-assessments/?days=${days}`);
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get('/emotions/dashboard/');
    return response.data;
  },
};

export default api;
