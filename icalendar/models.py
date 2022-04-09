from django.db import models
#Uses default Django User model
from django.contrib.auth.models import User
from django.utils.timezone import make_naive

#Class for event and tasks
class Event(models.Model):
    #Important fields
    starttime = models.DateTimeField(auto_now_add=False)
    endtime = models.DateTimeField(auto_now_add=False)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=128)
    #Additional users
    users = models.ManyToManyField(User, related_name="additional_users")
    task = models.BooleanField()
    taskcompleted = models.BooleanField(default=False)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="event")
    TAG_CHOICES = [
        ('HI', 'High'),
        ('ME', 'Medium'),
        ('LO', 'Low')
    ]
    tag = models.CharField(max_length=2, choices=TAG_CHOICES, default='ME')
    def serialize(self):
        return {
            "id": self.id,
            "starttime": make_naive(self.starttime),
            "endtime": make_naive(self.endtime),
            "title": self.title,
            "description": self.description,
            "users": [f"{user.id}, {user.username}" for user in self.users.all()],
            "task": self.task,
            "taskcompleted": self.taskcompleted,
            "host": self.host.username,
            "tag": self.tag
        }

#Class for month
class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    month = models.DateTimeField(auto_now_add=False)
    notes = models.CharField(max_length=1024)
