# Generated by Django 5.0.6 on 2024-06-18 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livingstonesapp', '0003_gameplayer_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gameplayer',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]