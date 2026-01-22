from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'age', 'delivery_date', 'created_at')
    list_filter = ('user_type', 'created_at', 'delivery_date')
    search_fields = ('username', 'email')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'age', 'delivery_date', 'support_system')
        }),
    )
