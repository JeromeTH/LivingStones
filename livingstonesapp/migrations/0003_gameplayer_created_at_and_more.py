# Generated by Django 5.0.6 on 2024-05-30 07:40

import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livingstonesapp', '0002_remove_game_participants_gameplayer_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='gameplayer',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddIndex(
            model_name='gameplayer',
            index=models.Index(fields=['game'], name='livingstone_game_id_c56649_idx'),
        ),
        migrations.AddIndex(
            model_name='gameplayer',
            index=models.Index(fields=['user'], name='livingstone_user_id_d3abbe_idx'),
        ),
        migrations.AddIndex(
            model_name='gameplayer',
            index=models.Index(fields=['created_at'], name='livingstone_created_00dc3a_idx'),
        ),
    ]
