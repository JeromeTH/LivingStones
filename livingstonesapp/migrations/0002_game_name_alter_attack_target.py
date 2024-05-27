# Generated by Django 5.0.6 on 2024-05-24 01:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livingstonesapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='attack',
            name='target',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attacked_by', to='livingstonesapp.monster'),
        ),
    ]