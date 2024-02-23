from django.db import models
from api.models import Room

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    token_type = models.CharField(max_length=50)
    expires_in = models.DateTimeField()


class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

# ForeingKey -> we need to pass an instance of another object. It will store a reference to that room in our vote
# on_delete - models.CASCADE -> it will cascade down and delete anything referencing the room (If the room is deleted, all votes are deleted)