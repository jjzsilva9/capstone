from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Event(models.Model):
    starttime = models.DateTimeField(auto_now_add=False)
    endtime = models.DateTimeField(auto_now_add=False)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=128)
    users = models.ManyToManyField(User)