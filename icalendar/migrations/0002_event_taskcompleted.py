# Generated by Django 3.1.7 on 2021-12-05 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('icalendar', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='taskcompleted',
            field=models.BooleanField(default=False),
        ),
    ]
