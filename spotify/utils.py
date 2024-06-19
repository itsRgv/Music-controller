from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import base64

BASE_URL = "https://api.spotify.com/v1/me/"

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
        expiry = token.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_key)
        return True
    return False
    

def refresh_spotify_token(session_key):
    refresh_token = getSpotifyTokens(session_key).refresh_token
    url = "https://accounts.spotify.com/api/token"

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }


    response = post(url, data=data, headers=headers)
    token_response = response.json()
    access_token = token_response.get('access_token')
    token_type = token_response.get('token_type')
    expires_in = token_response.get('expires_in')

    update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in)


def execute_spotify_api_request(session_key, endpoint, post_ = False, put_ = False):
    tokens = getSpotifyTokens(session_key)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + tokens.access_token
    }
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)
    
    response = get(BASE_URL + endpoint, {}, headers=headers) 
    print(response)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}
    
def play_song(session_key):
    return execute_spotify_api_request(session_key, "player/play", put_=True)


def pause_song(session_key):
    return execute_spotify_api_request(session_key, "player/pause", put_=True)


def skip_song(session_key):
    return execute_spotify_api_request(session_key, "player/next", post_=True)
