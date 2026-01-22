from django.contrib import admin
from .models import EmotionEntry, RiskAssessment


@admin.register(EmotionEntry)
class EmotionEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'mood', 'anxiety_level', 'sleep_hours', 'risk_category')
    list_filter = ('mood', 'risk_category', 'date')
    search_fields = ('user__username', 'journal_text')
    readonly_fields = ('risk_score', 'risk_category', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'date', 'mood')
        }),
        ('Measurements', {
            'fields': ('anxiety_level', 'sleep_hours', 'energy_level', 'appetite')
        }),
        ('Journal', {
            'fields': ('journal_text',)
        }),
        ('ML Predictions', {
            'fields': ('risk_score', 'risk_category'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(RiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'risk_category', 'risk_score')
    list_filter = ('risk_category', 'date')
    search_fields = ('user__username',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'date', 'risk_category', 'risk_score')
        }),
        ('Analysis', {
            'fields': ('contributing_factors', 'recommendations'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        })
    )
