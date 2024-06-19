from django.urls import path
from .views import *
urlpatterns = [
    path('get-auth-url', AuthURL.as_view()), # this is the main url for the frontend
    path('is-authenticated', IsAuthenticated.as_view()),
    path('redirect', spotify_callback),
    path('get-current-song', GetCurrentSong.as_view()),
    path('pause-song', PauseSong.as_view()),
    path('play-song', PlaySong.as_view()),
    path('skip-song', SkipSong.as_view())
]