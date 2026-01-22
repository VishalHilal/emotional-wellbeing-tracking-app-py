from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class EmotionEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('anxious', 'Anxious'),
        ('neutral', 'Neutral'),
    ]
    
    ENERGY_LEVELS = [
        (1, 'Very Low'),
        (2, 'Low'),
        (3, 'Moderate'),
        (4, 'High'),
        (5, 'Very High'),
    ]
    
    APPETITE_LEVELS = [
        (1, 'Very Poor'),
        (2, 'Poor'),
        (3, 'Normal'),
        (4, 'Good'),
        (5, 'Very Good'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emotion_entries')
    date = models.DateField()
    mood = models.CharField(max_length=10, choices=MOOD_CHOICES)
    anxiety_level = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    sleep_hours = models.FloatField()
    energy_level = models.IntegerField(choices=ENERGY_LEVELS)
    appetite = models.IntegerField(choices=APPETITE_LEVELS)
    journal_text = models.TextField(blank=True, null=True)
    
    # ML predictions
    risk_score = models.FloatField(null=True, blank=True)
    risk_category = models.CharField(max_length=20, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.mood}"


class RiskAssessment(models.Model):
    RISK_CATEGORIES = [
        ('low', 'Low Risk'),
        ('moderate', 'Moderate Risk'),
        ('high', 'High Risk'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='risk_assessments')
    date = models.DateField()
    risk_category = models.CharField(max_length=20, choices=RISK_CATEGORIES)
    risk_score = models.FloatField()
    contributing_factors = models.JSONField(default=dict)
    recommendations = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.risk_category}"
