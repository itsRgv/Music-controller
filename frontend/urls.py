
from django.urls import path
from .views import index

urlpatterns = [
    path('', index), # this is the main url for the frontend
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]