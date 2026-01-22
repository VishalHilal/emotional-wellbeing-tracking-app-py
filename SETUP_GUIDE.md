# 🚀 Complete Setup Guide

This guide will help you set up the entire Emotion Tracker app from scratch.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed  
- [ ] PostgreSQL installed (or use SQLite for development)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Smartphone for testing (optional)

## 🗂️ Project Structure

```
emotion-tracker/
├── backend/           # Django backend with ML
├── frontend/          # React Native app
├── README.md         # Main documentation
└── SETUP_GUIDE.md    # This file
```

## 🔧 Step 1: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd emotion-tracker

# Verify structure
ls
# Should see: backend/ frontend/ README.md SETUP_GUIDE.md
```

## 🐍 Step 2: Backend Setup

### 2.1 Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Verify activation (should see (venv) in prompt)
```

### 2.2 Install Dependencies

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify installation
python -c "import django; print('Django version:', django.get_version())"
```

### 2.3 Database Setup

#### Option A: PostgreSQL (Recommended for Production)

```bash
# Create database
createdb emotion_tracker

# Create user (optional)
createuser --interactive emotion_tracker_user
```

#### Option B: SQLite (Easy for Development)

Edit `backend/backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 2.4 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
# Windows:
notepad .env
# Mac/Linux:
nano .env
```

Add your database settings:
```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
DB_NAME=emotion_tracker
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 2.5 Train ML Models

```bash
# Train the ML models
python emotion_tracking/train_models.py

# You should see output like:
# Generating synthetic training data...
# Training Random Forest model...
# Model accuracy: 0.850
# Models saved to emotion_tracking/saved_models/
```

### 2.6 Django Setup

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (optional but recommended)
python manage.py createsuperuser

# Follow prompts to create admin user
```

### 2.7 Test Backend

```bash
# Start development server
python manage.py runserver

# You should see:
# Watching for file changes...
# Starting development server at http://127.0.0.1:8000/
```

Test in browser:
- Go to http://127.0.0.1:8000/admin/
- Login with superuser credentials
- Go to http://127.0.0.1:8000/api/ (should show API endpoints)

## 📱 Step 3: Frontend Setup

### 3.1 Install Node Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# This may take a few minutes
```

### 3.2 Configure API Connection

Edit `frontend/src/api/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### 3.3 Test Frontend

```bash
# Start Expo development server
npm start

# You should see QR code and options
```

#### Testing Options:

1. **Web Browser**:
   - Press 'w' in terminal
   - Opens at http://localhost:19006

2. **Physical Device**:
   - Install Expo Go app
   - Scan QR code with phone camera

3. **Android Emulator**:
   - Press 'a' in terminal
   - Requires Android Studio setup

4. **iOS Simulator**:
   - Press 'i' in terminal
   - Requires Xcode setup

## 🧪 Step 4: Full Integration Test

### 4.1 Start Both Servers

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver

# Terminal 2: Frontend  
cd frontend
npm start
```

### 4.2 Test Complete Flow

1. **Open the app** (web or mobile)
2. **Register new user**:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Age: 30
   - Delivery date: 2024-01-01
3. **Login** with new credentials
4. **Complete daily check-in**:
   - Select mood
   - Set anxiety level
   - Enter sleep hours
   - Set energy and appetite
   - Add journal entry
5. **View dashboard** with recommendations
6. **Check statistics** for trends

## 🔍 Step 5: Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'django'"
```bash
# Ensure virtual environment is activated
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Verify Django installed
python -c "import django"
```

#### "Models not found" error
```bash
# Train ML models
python emotion_tracking/train_models.py

# Check models directory
ls emotion_tracking/saved_models/
# Should see: risk_model.pkl, text_vectorizer.pkl, scaler.pkl
```

#### Database connection errors
```bash
# Check PostgreSQL is running
pg_ctl status

# Test connection
psql -h localhost -U postgres -d emotion_tracker

# For SQLite, ensure no permission issues
```

### Frontend Issues

#### "Metro bundler stuck"
```bash
# Clear cache
npm start -- --clear

# Reset node modules
rm -rf node_modules
npm install
```

#### "Network request failed"
```bash
# Check backend is running
curl http://localhost:8000/api/

# Verify API URL in frontend/src/api/api.js
```

#### "Can't find device"
```bash
# Check network connection
# Ensure phone and computer on same WiFi
# Use Expo Go app for physical device testing
```

## 🚀 Step 6: Production Deployment

### Backend Production

1. **Set up production database**:
   ```bash
   createdb emotion_tracker_prod
   ```

2. **Configure production settings**:
   ```bash
   export DEBUG=False
   export SECRET_KEY=your-production-secret-key
   export DB_NAME=emotion_tracker_prod
   ```

3. **Install production server**:
   ```bash
   pip install gunicorn
   pip install psycopg2-binary
   ```

4. **Run with Gunicorn**:
   ```bash
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Production

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Configure build**:
   ```bash
   eas build:configure
   ```

3. **Build for Android**:
   ```bash
   eas build --platform android
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

## 📚 Next Steps

### Development
- [ ] Add more ML features
- [ ] Implement push notifications
- [ ] Add more chart types
- [ ] Improve UI/UX

### Testing
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] User testing sessions

### Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring
- [ ] Set up analytics

## 🆘 Getting Help

### Documentation
- Main README: `/README.md`
- Backend docs: `/backend/README.md`
- Frontend docs: `/frontend/README.md`

### Common Issues
- Check the troubleshooting section above
- Search GitHub issues
- Check official documentation

### Community
- GitHub Discussions
- Stack Overflow
- Discord/Slack communities

---

## ✅ Success Checklist

You're all set if:

- [ ] Backend server runs without errors
- [ ] ML models are trained and saved
- [ ] Frontend app loads successfully
- [ ] User registration works
- [ ] Login works
- [ ] Daily check-in submits data
- [ ] Dashboard shows recommendations
- [ ] Statistics display charts

If any of these fail, revisit the relevant troubleshooting section.

Happy coding! 🎉
