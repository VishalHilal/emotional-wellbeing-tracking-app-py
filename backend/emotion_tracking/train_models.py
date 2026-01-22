#!/usr/bin/env python
"""
Training script for emotion risk prediction models
Run this script to train and save ML models
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
from datetime import datetime, timedelta
import random


def generate_synthetic_data(n_samples=1000):
    """Generate synthetic training data for demonstration"""
    np.random.seed(42)
    random.seed(42)
    
    data = []
    
    # Mood mapping
    moods = ['happy', 'sad', 'angry', 'anxious', 'neutral']
    mood_risk = {'happy': 0.1, 'neutral': 0.3, 'sad': 0.6, 'anxious': 0.7, 'angry': 0.8}
    
    for i in range(n_samples):
        # Generate base features
        mood = random.choice(moods)
        anxiety_level = random.randint(1, 5)
        sleep_hours = np.random.normal(7, 2)  # Normal distribution around 7 hours
        sleep_hours = max(0, min(12, sleep_hours))  # Clamp between 0-12
        energy_level = random.randint(1, 5)
        appetite = random.randint(1, 5)
        
        # Generate journal text based on mood
        journal_texts = {
            'happy': ["feeling good today", "baby is smiling", "great day", "so happy"],
            'sad': ["feeling down", "miss my old life", "crying a lot", "feeling empty"],
            'anxious': ["worried about baby", "can't sleep", "overwhelmed", "anxious thoughts"],
            'angry': ["frustrated", "irritable", "angry at nothing", "losing patience"],
            'neutral': ["okay today", "normal day", "nothing special", "just another day"]
        }
        journal_text = random.choice(journal_texts[mood])
        
        # Calculate risk score based on features
        base_risk = mood_risk[mood]
        
        # Adjust risk based on other factors
        if anxiety_level >= 4:
            base_risk += 0.2
        if sleep_hours < 6:
            base_risk += 0.15
        if energy_level <= 2:
            base_risk += 0.1
        if appetite <= 2:
            base_risk += 0.1
        
        # Add some randomness
        base_risk += np.random.normal(0, 0.1)
        base_risk = max(0, min(1, base_risk))
        
        # Determine risk category
        if base_risk < 0.3:
            risk_category = 'low'
        elif base_risk < 0.7:
            risk_category = 'moderate'
        else:
            risk_category = 'high'
        
        data.append({
            'mood': mood,
            'anxiety_level': anxiety_level,
            'sleep_hours': sleep_hours,
            'energy_level': energy_level,
            'appetite': appetite,
            'journal_text': journal_text,
            'risk_category': risk_category,
            'risk_score': base_risk
        })
    
    return pd.DataFrame(data)


def train_models():
    """Train and save ML models"""
    print("Generating synthetic training data...")
    df = generate_synthetic_data(2000)
    
    # Prepare features
    # Convert mood to numeric
    mood_mapping = {'happy': 5, 'neutral': 3, 'sad': 2, 'anxious': 1, 'angry': 1}
    df['mood_numeric'] = df['mood'].map(mood_mapping)
    
    # Numeric features
    numeric_features = ['mood_numeric', 'anxiety_level', 'sleep_hours', 'energy_level', 'appetite']
    X_numeric = df[numeric_features]
    
    # Text features
    tfidf = TfidfVectorizer(max_features=100, stop_words='english')
    X_text = tfidf.fit_transform(df['journal_text'].fillna(''))
    
    # Combine features
    X = np.hstack([X_numeric.values, X_text.toarray()])
    y = df['risk_category']
    
    # Scale numeric features
    scaler = StandardScaler()
    X_numeric_scaled = scaler.fit_transform(X_numeric)
    
    # Recombine with scaled numeric features
    X = np.hstack([X_numeric_scaled, X_text.toarray()])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save models
    model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    os.makedirs(model_dir, exist_ok=True)
    
    print("Saving models...")
    joblib.dump(model, os.path.join(model_dir, 'risk_model.pkl'))
    joblib.dump(tfidf, os.path.join(model_dir, 'text_vectorizer.pkl'))
    joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))
    
    # Save feature info for reference
    feature_info = {
        'numeric_features': numeric_features,
        'mood_mapping': mood_mapping,
        'model_accuracy': accuracy
    }
    joblib.dump(feature_info, os.path.join(model_dir, 'feature_info.pkl'))
    
    print(f"Models saved to {model_dir}")
    print("Training complete!")
    
    return model, tfidf, scaler


if __name__ == "__main__":
    train_models()
