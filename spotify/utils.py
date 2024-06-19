from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

def getSpotifyTokens(session_key):
    tokens = SpotifyToken.objects.filter(user = session_key)
    if tokens.exists():
        return tokens[0]
    return None

def update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in):
    token = getSpotifyTokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if token:
        token.access_token = access_token
        token.refresh_token = refresh_token
        token.token_type = token_type
        token.expires_in = expires_in
        token.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
    else:
        token = SpotifyToken(user = session_key, access_token = access_token, refresh_token = refresh_token, token_type = token_type, expires_in = expires_in)
        token.save()


def is_spotify_authenticated(session_key):
    token = getSpotifyTokens(session_key)

    if token:
        if token.expires_in <= timezone.now():
            refresh_spotify_token(session_key)

        return True
    return False
    

def refresh_spotify_token(session_key):
    refresh_token = getSpotifyTokens(session_key).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(
        session_key, access_token, token_type, expires_in, refresh_token)
