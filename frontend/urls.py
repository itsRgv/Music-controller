
from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''), # this is the main url for the frontend
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]