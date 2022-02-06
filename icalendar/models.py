from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Tag(models.Model):
    title = models.CharField(max_length=32)
    COLOR_CHOICES = [
        ("BL", 0x3362FF),
        ("GR", 0x1EE42E),
        ("RE", 0xE4261E),
        ("PI", 0xE41EA9),
        ("YE", 0xEAE61F),
        ("PU", 0xC11EE4),
        ("OR", 0xFBAA17)
    ]
    color = models.CharField(choices= COLOR_CHOICES, max_length=2, default="BL")

class Event(models.Model):
    starttime = models.DateTimeField(auto_now_add=False)
    endtime = models.DateTimeField(auto_now_add=False)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=128)
    users = models.ManyToManyField(User, related_name="additional_users")
    task = models.BooleanField()
    taskcompleted = models.BooleanField(default=False)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="event")
    tags = models.ManyToManyField(Tag, related_name="event")
    def serialize(self):
        return {
            "id": self.id,
            "starttime": self.starttime,
            "endtime": self.endtime,
            "title": self.title,
            "description": self.description,
            "users": [f"{user.id}, {user.username}" for user in self.users.all()],
            "task": self.task,
            "taskcompleted": self.taskcompleted,
            "host": self.host.username
        }