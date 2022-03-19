from random import choices
from django.db import models
#Uses default Django User model
from django.contrib.auth.models import User


#Class for tags
#class Tag(models.Model):
    #Choices for the colours which can be chosen
#    COLOR_CHOICES = [
 #       ("BL", 0x3362FF),
#        ("GR", 0x1EE42E),
#        ("RE", 0xE4261E),
 #       ("PI", 0xE41EA9),
 #       ("YE", 0xEAE61F),
 #       ("PU", 0xC11EE4),
  #      ("OR", 0xFBAA17)
  #  ]
    
 #   color = models.CharField(choices= COLOR_CHOICES, max_length=2, default="BL")
    

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
    URGENCY_CHOICE = [
        ("CR", "Critical"),
        ("HI", "High"),
        ("ME", "Medium"),
        ("LO", "Low")
    ]
    urgency = models.CharField(choices=URGENCY_CHOICE, max_length=2)
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

#Class for month
class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    month = models.DateTimeField(auto_now_add=False)
    notes = models.CharField(max_length=1024)
