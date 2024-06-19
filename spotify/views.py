from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from requests import Request, post
from .utils import update_or_create_user_tokens, is_spotify_authenticated
import base64


class AuthURL(APIView):

    def get(self, request, format = None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope':scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
    
        return Response({'url' : url}, status=status.HTTP_200_OK)


def spotify_callback(request, format = None):
    code = request.GET.get('code') or None
    error = request.GET.get('error') or None

    if code:
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }, 
        headers={
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('ascii')).decode('ascii')    
        }).json()

        print(response)

        access_token = response.get('access_token')
        refresh_token = response.get('refresh_token')
        token_type = response.get('token_type')
        expires_in = response.get('expires_in')
        error = response.get('error')
        print(expires_in)

        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_user_tokens(request.session.session_key, access_token, refresh_token, token_type, expires_in)

        return redirect('frontend:')

    return Response({'message':'Authorization failed'}, status=status.HTTP_401_UNAUTHORIZED)



class IsAuthenticated(APIView):
    def get(self, request, format = None):
        isAuthenticated = is_spotify_authenticated(self.request.session.session_key)
        
        return Response({'status' : isAuthenticated}, status=status.HTTP_200_OK)
