
from django.urls import path
from .views import AuthURL, IsAuthenticated, spotify_callback

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()), # this is the main url for the frontend
    path('is-authenticated', IsAuthenticated.as_view()),
    path('redirect', spotify_callback)
]