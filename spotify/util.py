from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import *
from requests import post, put, get


BASE_URL = "https://api.spotify.com/v1/me"

def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    return None


def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    token = get_user_tokens(session_key)
    expires = timezone.now() + timedelta(seconds=expires_in)
    
    if token:
        #token.clean()
        token.access_token = access_token
        token.refresh_token = refresh_token or token.refresh_token
        token.expires_in = expires
        token.token_type = token_type
        token.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_key, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expires = tokens.expires_in
        if expires <= timezone.now():
            refresh_spotify_token(tokens)
        return True
    return False


def refresh_spotify_token(tokens):
    refresh_token = tokens.refresh_token
    response = post('https://accounts.spotify.com/api/token', data={'grant_type': 'refresh_token',
                                                                    'refresh_token': refresh_token,
                                                                    'client_id': CLIENT_ID,
                                                                    'client_secret': CLIENT_SECRET}).json()
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    update_or_create_user_tokens(tokens.user, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token }

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'error': 'Problem with the request'}
    

def play_song(session_key):
    return execute_spotify_api_request(session_key, "/player/play", put_=True)

def pause_song(session_key):
    return execute_spotify_api_request(session_key, "/player/pause", put_=True)

def skip_song(session_key):
    return execute_spotify_api_request(session_key, "/player/next", post_=True)