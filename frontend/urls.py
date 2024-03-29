from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('create', index),
    path('join', index),
    path('info', index),
    path('room/<str:roomCode>', index),
]