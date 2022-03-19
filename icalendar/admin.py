from django.contrib import admin
from icalendar.models import Event, Note
# Register your models here.
admin.site.register(Event)
admin.site.register(Note)