from rest_framework import serializers
from .models import EmotionEntry, RiskAssessment


class EmotionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionEntry
        fields = [
            'id', 'date', 'mood', 'anxiety_level', 'sleep_hours', 
            'energy_level', 'appetite', 'journal_text', 
            'risk_score', 'risk_category', 'created_at'
        ]
        read_only_fields = ['risk_score', 'risk_category', 'created_at']

    def validate_anxiety_level(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Anxiety level must be between 1 and 5")
        return value

    def validate_sleep_hours(self, value):
        if not 0 <= value <= 24:
            raise serializers.ValidationError("Sleep hours must be between 0 and 24")
        return value

    def validate_energy_level(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Energy level must be between 1 and 5")
        return value

    def validate_appetite(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Appetite must be between 1 and 5")
        return value


class RiskAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAssessment
        fields = [
            'id', 'date', 'risk_category', 'risk_score', 
            'contributing_factors', 'recommendations', 'created_at'
        ]
        read_only_fields = ['created_at']


class EmotionStatsSerializer(serializers.Serializer):
    avg_anxiety = serializers.FloatField()
    avg_sleep = serializers.FloatField()
    avg_energy = serializers.FloatField()
    avg_appetite = serializers.FloatField()
    mood_distribution = serializers.DictField()
    risk_trend = serializers.ListField()
    entries_count = serializers.IntegerField()
