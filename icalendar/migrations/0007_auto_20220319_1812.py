# Generated by Django 3.1.7 on 2022-03-19 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('icalendar', '0006_auto_20220319_1810'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='tags',
        ),
        migrations.AddField(
            model_name='event',
            name='urgency',
            field=models.CharField(choices=[('CR', 'Critical'), ('HI', 'High'), ('ME', 'Medium'), ('LO', 'Low')], default='ME', max_length=2),
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
