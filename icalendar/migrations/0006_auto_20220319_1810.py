# Generated by Django 3.1.7 on 2022-03-19 18:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('icalendar', '0005_auto_20220313_1737'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='title',
        ),
        migrations.RemoveField(
            model_name='tag',
            name='user',
        ),
        migrations.AddField(
            model_name='tag',
            name='urgency',
            field=models.CharField(choices=[('CR', 'Critical'), ('HI', 'High'), ('ME', 'Medium'), ('LO', 'Low')], default='ME', max_length=2),
        ),
        migrations.RemoveField(
            model_name='event',
            name='tags',
        ),
        migrations.AddField(
            model_name='event',
            name='tags',
            field=models.ForeignKey(default='ME', on_delete=django.db.models.deletion.CASCADE, related_name='event', to='icalendar.tag'),
            preserve_default=False,
        ),
    ]
