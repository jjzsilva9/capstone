from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Event(models.Model):
    starttime = models.DateTimeField(auto_now_add=False)
    endtime = models.DateTimeField(auto_now_add=False)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=128)
    users = models.ManyToManyField(User, related_name="additional_users")
    task = models.BooleanField()
    taskcompleted = models.BooleanField(default=False)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="event")

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