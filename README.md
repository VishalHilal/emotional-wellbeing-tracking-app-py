# 🌸 Emotion Tracker - Postpartum Mental Health App

A full-stack mobile application focused on postpartum emotional wellbeing support with ML-based risk assessment.

## 📱 About

This app helps new mothers track their emotional wellbeing through daily check-ins, providing personalized insights and recommendations based on machine learning analysis. Built with privacy and healthcare safety in mind.

### 🎯 Key Features

- **Daily Emotion Tracking**: Mood, anxiety, sleep, energy, appetite
- **ML Risk Assessment**: Local, explainable AI models (no external APIs)
- **Personalized Recommendations**: Based on individual patterns
- **Data Visualization**: Mood trends and progress charts
- **Privacy-First**: Local ML models, encrypted data storage
- **Healthcare Safe**: Clear disclaimers, encourage professional help

## 🏗️ Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Chart Kit** for data visualization
- **AsyncStorage** for local data

### Backend + ML
- **Python Django** with Django REST Framework
- **PostgreSQL** database
- **scikit-learn** for ML models
- **Random Forest** for risk classification
- **TF-IDF** for text analysis
- **JWT Authentication**

### ML Models (Local, Lightweight)
- **Risk Prediction**: Random Forest classifier
- **Text Analysis**: TF-IDF + Logistic Regression
- **Features**: Mood, anxiety, sleep, energy, appetite, journal text

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (or use SQLite for development)
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run automated setup
python setup.py

# Or manual setup:
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Train ML models
python emotion_tracking/train_models.py

# Set up environment
cp .env.example .env
# Edit .env with your database settings

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run on device/simulator
npm run android    # Android
npm run ios        # iOS
npm run web        # Web (for testing)
```

### 3. Configuration

1. **Backend API URL**: Update `frontend/src/api/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

2. **Database**: Configure PostgreSQL in `backend/.env`:
   ```
   DB_NAME=emotion_tracker
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

## 📊 How It Works

### 1. User Registration & Onboarding
- Mother creates account with basic info
- Optional: Age, delivery date, support system

### 2. Daily Check-in
- Select current mood (Happy, Sad, Angry, Anxious, Neutral)
- Rate anxiety level (1-5)
- Log sleep hours
- Rate energy and appetite (1-5)
- Optional journal entry

### 3. ML Analysis
- Data processed through local ML models
- Risk score calculated (0-1)
- Risk category assigned (Low/Moderate/High)
- Contributing factors identified

### 4. Personalized Recommendations
- **Low Risk**: Self-care tips, maintain routine
- **Moderate Risk**: Coping strategies, lifestyle guidance
- **High Risk**: Encourage professional help, helpline info

### 5. Progress Tracking
- Mood trends over time
- Sleep vs mood correlation
- Weekly emotional summaries
- Statistical insights

## 🤖 Machine Learning Details

### Models Used

1. **Risk Classification**: Random Forest
   - Input: Mood, anxiety, sleep, energy, appetite, text features
   - Output: Risk category (Low/Moderate/High)
   - Accuracy: ~85% on synthetic data

2. **Text Analysis**: TF-IDF + Logistic Regression
   - Input: Journal text
   - Output: Sentiment features for risk model
   - Lightweight, fast inference

### Training Data
- Synthetic dataset (2000 samples)
- Realistic postpartum scenarios
- Balanced risk categories
- Feature engineering for healthcare context

### Model Storage
- Saved as `.pkl` files in `backend/emotion_tracking/saved_models/`
- Loaded at Django startup
- No external API calls
- CPU-only inference

## 🔒 Privacy & Security

### Data Protection
- **Local ML**: No data sent to external AI services
- **Encryption**: All sensitive data encrypted
- **JWT Tokens**: Secure authentication
- **HIPAA Considerations**: Healthcare-safe messaging

### Ethical Safeguards
- **No Medical Diagnosis**: Clear about support tool nature
- **Professional Help**: Always recommends professional consultation
- **Crisis Support**: Provides helpline information
- **Transparent**: Explainable AI factors

## 📱 App Screens

### 1. Authentication
- **Login**: Secure user authentication
- **Register**: Account creation with optional details

### 2. Home Dashboard
- Today's check-in status
- Current mood and risk level
- Streak tracking
- Quick actions

### 3. Daily Check-in
- Mood selection with emojis
- Anxiety, sleep, energy, appetite sliders
- Optional journal entry
- Real-time ML analysis

### 4. Statistics
- Mood distribution charts
- Risk trend analysis
- Sleep patterns
- Personalized insights

### 5. Profile
- User information management
- Settings and preferences
- Privacy policy
- Help & support

## 🛠️ Development

### Backend Structure
```
backend/
├── backend/          # Django settings
├── accounts/         # User management
├── emotion_tracking/ # Core app with ML
├── saved_models/     # Trained ML models
└── requirements.txt  # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/         # API client
│   ├── screens/     # App screens
│   └── components/  # Reusable components
├── assets/          # Images, icons
└── App.js          # Main app component
```

### API Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile

#### Emotion Tracking
- `GET /api/emotions/entries/` - Get emotion entries
- `POST /api/emotions/entries/` - Create entry
- `GET /api/emotions/stats/` - Get statistics
- `GET /api/emotions/dashboard/` - Dashboard summary

## 📦 Deployment

### Backend (Production)

1. **Database Setup**:
   ```bash
   # Production PostgreSQL
   createdb emotion_tracker_prod
   ```

2. **Environment Variables**:
   ```bash
   export DEBUG=False
   export SECRET_KEY=your-production-secret
   export DB_NAME=emotion_tracker_prod
   ```

3. **Deploy with Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn backend.wsgi:application
   ```

4. **Use Nginx + SSL** for production

### Frontend (Production)

1. **Build with EAS**:
   ```bash
   npm install -g eas-cli
   eas build --platform android
   eas build --platform ios
   ```

2. **Submit to App Stores**:
   - Google Play Store (Android)
   - Apple App Store (iOS)

## 🧪 Testing

### Backend Tests
```bash
# Run Django tests
python manage.py test

# Test ML models
python emotion_tracking/test_models.py
```

### Frontend Tests
```bash
# Install testing dependencies
npm install --save-dev jest

# Run tests
npm test
```

## 📈 Performance

### Backend
- **Response Time**: <200ms for API calls
- **ML Inference**: <50ms per prediction
- **Database**: Optimized queries with indexes

### Frontend
- **App Load**: <3 seconds
- **Navigation**: Smooth transitions
- **Charts**: Optimized rendering

## 🔧 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check virtual environment activation
   - Verify database connection
   - Run migrations

2. **ML models not loading**:
   - Run training script: `python emotion_tracking/train_models.py`
   - Check model file permissions

3. **Frontend connection issues**:
   - Verify backend is running
   - Check API URL configuration
   - Ensure same network (for mobile testing)

4. **Build failures**:
   - Clear node modules: `rm -rf node_modules && npm install`
   - Clear Expo cache: `expo start --clear`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Style
- **Python**: PEP 8
- **JavaScript**: ESLint + Prettier
- **React Native**: Official guidelines

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### For Users
- **Email**: support@emotiontracker.app
- **Helpline**: 1-800-PPD-MOMS
- **Crisis**: 988 (Suicide & Crisis Lifeline)

### For Developers
- **Documentation**: Check README files in backend/frontend
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub Discussions

## 🙏 Acknowledgments

- Postpartum mental health professionals
- Open source community
- Healthcare AI ethics guidelines
- User feedback and testing

---

**⚠️ Medical Disclaimer**: This app is not a medical diagnostic tool. Always consult healthcare professionals for medical concerns. If experiencing severe symptoms, please seek immediate medical attention or call emergency services.
