#!/usr/bin/env python
"""
Setup script for the emotion tracker backend
Run this script to set up the virtual environment and install dependencies
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*50}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print(f"{'='*50}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ Success!")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("❌ Error!")
        print(f"Return code: {e.returncode}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False

def main():
    print("🚀 Setting up Emotion Tracker Backend")
    
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    # Step 1: Create virtual environment
    if not os.path.exists('venv'):
        print("\n📦 Creating virtual environment...")
        if not run_command(f"{sys.executable} -m venv venv", "Create virtual environment"):
            print("Failed to create virtual environment")
            return False
    else:
        print("\n✅ Virtual environment already exists")
    
    # Step 2: Activate virtual environment and install dependencies
    print("\n📦 Installing dependencies...")
    
    # Determine activation script and commands based on OS
    if os.name == 'nt':  # Windows
        pip_command = "venv\\Scripts\\python.exe -m pip"
        python_command = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        pip_command = "venv/bin/pip"
        python_command = "venv/bin/python"
    
    # Upgrade pip
    if not run_command(f"{pip_command} install --upgrade pip", "Upgrade pip"):
        print("Failed to upgrade pip, continuing with existing version...")
        # Don't fail the entire setup if pip upgrade fails
    
    # Install requirements
    if not run_command(f"{python_command} -m pip install -r requirements.txt", "Install requirements"):
        print("Failed to install requirements")
        return False
    
    # Step 3: Train ML models
    print("\n🤖 Training ML models...")
    if not run_command(f"{python_command} emotion_tracking/train_models.py", "Train ML models"):
        print("Failed to train ML models")
        return False
    
    # Step 4: Run Django migrations
    print("\n🗄️ Running Django migrations...")
    
    # Remove existing migrations to avoid conflicts with custom User model
    import shutil
    migrations_dirs = ['accounts/migrations', 'emotion_tracking/migrations']
    for mig_dir in migrations_dirs:
        if os.path.exists(mig_dir):
            # Remove all migration files except __init__.py
            for file in os.listdir(mig_dir):
                if file.endswith('.py') and file != '__init__.py':
                    os.remove(os.path.join(mig_dir, file))
    
    if not run_command(f"{python_command} manage.py makemigrations", "Create migrations"):
        print("Failed to create migrations")
        return False
    
    if not run_command(f"{python_command} manage.py migrate", "Apply migrations"):
        print("Failed to apply migrations")
        return False
    
    # Step 5: Create superuser (optional)
    print("\n👤 Creating superuser (optional)...")
    print("You can create a superuser later by running:")
    print(f"{python_command} manage.py createsuperuser")
    
    print("\n" + "="*50)
    print("🎉 Setup completed successfully!")
    print("="*50)
    print("\nNext steps:")
    print("1. Start the development server:")
    print(f"   {python_command} manage.py runserver")
    print("\n2. In a new terminal, start the React Native app:")
    print("   cd ../frontend && npm install && npm start")
    print("\n3. Access the API at: http://localhost:8000/api/")
    print("4. Access admin panel at: http://localhost:8000/admin/")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Setup failed. Please check the error messages above.")
        sys.exit(1)
