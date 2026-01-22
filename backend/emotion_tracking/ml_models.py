import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta


class EmotionRiskPredictor:
    def __init__(self):
        self.model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
        os.makedirs(self.model_dir, exist_ok=True)
        
        self.risk_model = None
        self.text_vectorizer = None
        self.scaler = None
        self.load_models()
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            self.risk_model = joblib.load(os.path.join(self.model_dir, 'risk_model.pkl'))
            self.text_vectorizer = joblib.load(os.path.join(self.model_dir, 'text_vectorizer.pkl'))
            self.scaler = joblib.load(os.path.join(self.model_dir, 'scaler.pkl'))
        except FileNotFoundError:
            print("Models not found. Please train the models first using train_models.py")
    
    def preprocess_features(self, data):
        """Preprocess input data for ML prediction"""
        # Convert mood to numeric
        mood_mapping = {'happy': 5, 'neutral': 3, 'sad': 2, 'anxious': 1, 'angry': 1}
        
        features = []
        for entry in data:
            feature_vector = [
                mood_mapping.get(entry['mood'], 3),
                entry['anxiety_level'],
                entry['sleep_hours'],
                entry['energy_level'],
                entry['appetite'],
            ]
            features.append(feature_vector)
        
        features = np.array(features)
        
        # Scale features
        if self.scaler:
            features = self.scaler.transform(features)
        
        return features
    
    def extract_text_features(self, journal_text):
        """Extract features from journal text"""
        if not journal_text or not self.text_vectorizer:
            return np.zeros((1, 100))  # Return zero vector if no text or model
        
        text_features = self.text_vectorizer.transform([journal_text])
        return text_features.toarray()
    
    def predict_risk(self, emotion_data, journal_text=""):
        """Predict risk category and score"""
        if not self.risk_model:
            return {
                'risk_score': 0.5,
                'risk_category': 'moderate',
                'contributing_factors': {},
                'error': 'Model not loaded'
            }
        
        # Preprocess numeric features
        numeric_features = self.preprocess_features([emotion_data])
        
        # Extract text features if available
        text_features = self.extract_text_features(journal_text)
        
        # Combine features
        combined_features = np.hstack([numeric_features, text_features])
        
        # Make prediction
        risk_score = self.risk_model.predict_proba(combined_features)[0, 1]  # Probability of high risk
        risk_category = self.risk_model.predict(combined_features)[0]
        
        # Determine contributing factors
        contributing_factors = self._analyze_contributing_factors(emotion_data, risk_score)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(risk_category, emotion_data)
        
        return {
            'risk_score': float(risk_score),
            'risk_category': risk_category,
            'contributing_factors': contributing_factors,
            'recommendations': recommendations
        }
    
    def _analyze_contributing_factors(self, emotion_data, risk_score):
        """Analyze which factors contribute most to risk score"""
        factors = {}
        
        # Sleep analysis
        if emotion_data['sleep_hours'] < 6:
            factors['sleep'] = 'Poor sleep may be affecting your wellbeing'
        elif emotion_data['sleep_hours'] > 9:
            factors['sleep'] = 'Excessive sleep might indicate low energy'
        
        # Anxiety analysis
        if emotion_data['anxiety_level'] >= 4:
            factors['anxiety'] = 'High anxiety levels detected'
        
        # Mood analysis
        if emotion_data['mood'] in ['sad', 'angry', 'anxious']:
            factors['mood'] = f'Current mood ({emotion_data["mood"]}) may need attention'
        
        # Energy analysis
        if emotion_data['energy_level'] <= 2:
            factors['energy'] = 'Low energy levels detected'
        
        # Appetite analysis
        if emotion_data['appetite'] <= 2:
            factors['appetite'] = 'Poor appetite may indicate stress'
        
        return factors
    
    def _generate_recommendations(self, risk_category, emotion_data):
        """Generate personalized recommendations based on risk category"""
        recommendations = []
        
        if risk_category == 'low':
            recommendations = [
                "Continue maintaining your current routine",
                "Practice daily gratitude exercises",
                "Stay connected with your support system",
                "Get regular gentle exercise like walking"
            ]
        elif risk_category == 'moderate':
            recommendations = [
                "Try deep breathing exercises for 5 minutes daily",
                "Consider talking to a friend or family member",
                "Maintain a consistent sleep schedule",
                "Practice self-care activities you enjoy",
                "Limit caffeine and screen time before bed"
            ]
        else:  # high
            recommendations = [
                "Consider reaching out to a healthcare professional",
                "Contact postpartum support helpline: 1-800-PPD-MOMS",
                "Ask your partner or family for additional support",
                "Prioritize rest and recovery",
                "Don't hesitate to seek professional help"
            ]
        
        # Add specific recommendations based on data
        if emotion_data['sleep_hours'] < 6:
            recommendations.append("Try to get at least 7-8 hours of sleep")
        
        if emotion_data['anxiety_level'] >= 4:
            recommendations.append("Practice mindfulness or meditation")
        
        return recommendations
