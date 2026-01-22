from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Avg, Count
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
import json

from .models import EmotionEntry, RiskAssessment
from .serializers import EmotionEntrySerializer, RiskAssessmentSerializer, EmotionStatsSerializer
from .ml_models import EmotionRiskPredictor


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def emotion_entries(request):
    if request.method == 'GET':
        # Get query parameters for filtering
        days = request.GET.get('days', 30)
        start_date = timezone.now().date() - timedelta(days=int(days))
        
        entries = EmotionEntry.objects.filter(
            user=request.user,
            date__gte=start_date
        ).order_by('-date')
        
        serializer = EmotionEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EmotionEntrySerializer(data=request.data)
        if serializer.is_valid():
            # Save the entry first
            entry = serializer.save(user=request.user)
            
            # Get ML prediction
            predictor = EmotionRiskPredictor()
            emotion_data = {
                'mood': entry.mood,
                'anxiety_level': entry.anxiety_level,
                'sleep_hours': entry.sleep_hours,
                'energy_level': entry.energy_level,
                'appetite': entry.appetite,
            }
            
            prediction = predictor.predict_risk(
                emotion_data, 
                entry.journal_text or ""
            )
            
            # Update entry with prediction
            entry.risk_score = prediction['risk_score']
            entry.risk_category = prediction['risk_category']
            entry.save()
            
            # Create or update risk assessment
            risk_assessment, created = RiskAssessment.objects.update_or_create(
                user=request.user,
                date=entry.date,
                defaults={
                    'risk_category': prediction['risk_category'],
                    'risk_score': prediction['risk_score'],
                    'contributing_factors': prediction['contributing_factors'],
                    'recommendations': prediction['recommendations']
                }
            )
            
            # Return updated entry with predictions
            response_data = EmotionEntrySerializer(entry).data
            response_data['recommendations'] = prediction['recommendations']
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def emotion_entry_detail(request, entry_id):
    try:
        entry = EmotionEntry.objects.get(id=entry_id, user=request.user)
    except EmotionEntry.DoesNotExist:
        return Response({'error': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EmotionEntrySerializer(entry)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = EmotionEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            updated_entry = serializer.save()
            
            # Recalculate ML prediction
            predictor = EmotionRiskPredictor()
            emotion_data = {
                'mood': updated_entry.mood,
                'anxiety_level': updated_entry.anxiety_level,
                'sleep_hours': updated_entry.sleep_hours,
                'energy_level': updated_entry.energy_level,
                'appetite': updated_entry.appetite,
            }
            
            prediction = predictor.predict_risk(
                emotion_data, 
                updated_entry.journal_text or ""
            )
            
            # Update entry with new prediction
            updated_entry.risk_score = prediction['risk_score']
            updated_entry.risk_category = prediction['risk_category']
            updated_entry.save()
            
            # Update risk assessment
            RiskAssessment.objects.update_or_create(
                user=request.user,
                date=updated_entry.date,
                defaults={
                    'risk_category': prediction['risk_category'],
                    'risk_score': prediction['risk_score'],
                    'contributing_factors': prediction['contributing_factors'],
                    'recommendations': prediction['recommendations']
                }
            )
            
            response_data = EmotionEntrySerializer(updated_entry).data
            response_data['recommendations'] = prediction['recommendations']
            
            return Response(response_data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def risk_assessments(request):
    days = request.GET.get('days', 30)
    start_date = timezone.now().date() - timedelta(days=int(days))
    
    assessments = RiskAssessment.objects.filter(
        user=request.user,
        date__gte=start_date
    ).order_by('-date')
    
    serializer = RiskAssessmentSerializer(assessments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def emotion_stats(request):
    days = request.GET.get('days', 30)
    start_date = timezone.now().date() - timedelta(days=int(days))
    
    entries = EmotionEntry.objects.filter(
        user=request.user,
        date__gte=start_date
    )
    
    if not entries.exists():
        return Response({
            'avg_anxiety': 0,
            'avg_sleep': 0,
            'avg_energy': 0,
            'avg_appetite': 0,
            'mood_distribution': {},
            'risk_trend': [],
            'entries_count': 0
        })
    
    # Calculate averages
    stats = entries.aggregate(
        avg_anxiety=Avg('anxiety_level'),
        avg_sleep=Avg('sleep_hours'),
        avg_energy=Avg('energy_level'),
        avg_appetite=Avg('appetite')
    )
    
    # Mood distribution
    mood_dist = entries.values('mood').annotate(count=Count('mood'))
    mood_distribution = {item['mood']: item['count'] for item in mood_dist}
    
    # Risk trend over time
    risk_trend = []
    daily_entries = entries.annotate(date_only=TruncDate('date')).values('date_only').annotate(
        avg_risk=Avg('risk_score'),
        count=Count('id')
    ).order_by('date_only')
    
    for item in daily_entries:
        if item['avg_risk'] is not None:
            risk_trend.append({
                'date': item['date_only'].strftime('%Y-%m-%d'),
                'risk_score': round(item['avg_risk'], 2),
                'entries': item['count']
            })
    
    response_data = {
        'avg_anxiety': round(stats['avg_anxiety'] or 0, 2),
        'avg_sleep': round(stats['avg_sleep'] or 0, 2),
        'avg_energy': round(stats['avg_energy'] or 0, 2),
        'avg_appetite': round(stats['avg_appetite'] or 0, 2),
        'mood_distribution': mood_distribution,
        'risk_trend': risk_trend,
        'entries_count': entries.count()
    }
    
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary data"""
    # Get today's entry if exists
    today = timezone.now().date()
    today_entry = EmotionEntry.objects.filter(user=request.user, date=today).first()
    
    # Get recent risk assessment
    recent_assessment = RiskAssessment.objects.filter(
        user=request.user
    ).order_by('-date').first()
    
    # Get streak (consecutive days with entries)
    streak = 0
    current_date = today
    while True:
        if EmotionEntry.objects.filter(user=request.user, date=current_date).exists():
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    # Get week trend
    week_start = today - timedelta(days=7)
    week_entries = EmotionEntry.objects.filter(
        user=request.user,
        date__gte=week_start
    ).order_by('date')
    
    week_moods = []
    for entry in week_entries:
        week_moods.append({
            'date': entry.date.strftime('%Y-%m-%d'),
            'mood': entry.mood,
            'risk_score': entry.risk_score or 0
        })
    
    response_data = {
        'today_entry': EmotionEntrySerializer(today_entry).data if today_entry else None,
        'recent_assessment': RiskAssessmentSerializer(recent_assessment).data if recent_assessment else None,
        'streak': streak,
        'week_moods': week_moods
    }
    
    return Response(response_data)
