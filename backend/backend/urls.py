from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "status": "Backend is running ",
        "message": "Emotion Tracker API is ready",
        "endpoints": {
            "admin": "/admin/",
            "api_auth": "/api/auth/",
            "api_emotions": "/api/emotions/"
        }
    })

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/emotions/', include('emotion_tracking.urls')),
]
