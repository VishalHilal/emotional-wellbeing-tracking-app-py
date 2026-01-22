# Emotion Tracker Backend

Django backend with ML models for postpartum emotional wellbeing tracking.

## Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
python setup.py
```

This will:
- Create virtual environment
- Install all dependencies
- Train ML models
- Run Django migrations

### Option 2: Manual Setup

1. **Create virtual environment:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Train ML models:**
```bash
python emotion_tracking/train_models.py
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database settings
```

5. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

7. **Start server:**
```bash
python manage.py runserver
```

## Environment Variables

Create a `.env` file with:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=emotion_tracker
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Emotion Tracking
- `GET /api/emotions/entries/` - Get emotion entries
- `POST /api/emotions/entries/` - Create emotion entry
- `GET /api/emotions/entries/{id}/` - Get specific entry
- `PUT /api/emotions/entries/{id}/` - Update entry
- `DELETE /api/emotions/entries/{id}/` - Delete entry

### Analytics
- `GET /api/emotions/stats/` - Get emotion statistics
- `GET /api/emotions/risk-assessments/` - Get risk assessments
- `GET /api/emotions/dashboard/` - Get dashboard summary

## ML Models

The system uses lightweight, local ML models:

- **Risk Prediction**: Random Forest classifier
- **Text Analysis**: TF-IDF + Logistic Regression
- **Features**: Mood, anxiety, sleep, energy, appetite, journal text

Models are trained on synthetic data and saved as `.pkl` files in `emotion_tracking/saved_models/`.

## Database Schema

### User Model
- Extends Django User
- Fields: age, delivery_date, support_system

### EmotionEntry
- Daily emotion tracking data
- ML predictions (risk_score, risk_category)

### RiskAssessment
- Risk analysis with contributing factors
- Personalized recommendations

## Development

### Running Tests
```bash
python manage.py test
```

### Admin Panel
Access at `http://localhost:8000/admin/`

### API Documentation
Use Django REST framework's browsable API at `http://localhost:8000/api/`

## Features

- ✅ JWT Authentication
- ✅ ML-based risk assessment
- ✅ Emotion trend analysis
- ✅ Personalized recommendations
- ✅ Data visualization support
- ✅ Privacy-focused design
- ✅ Healthcare-safe messaging
