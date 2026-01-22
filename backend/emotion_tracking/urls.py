from django.urls import path
from . import views

urlpatterns = [
    path('entries/', views.emotion_entries, name='emotion-entries'),
    path('entries/<int:entry_id>/', views.emotion_entry_detail, name='emotion-entry-detail'),
    path('risk-assessments/', views.risk_assessments, name='risk-assessments'),
    path('stats/', views.emotion_stats, name='emotion-stats'),
    path('dashboard/', views.dashboard_summary, name='dashboard-summary'),
]
