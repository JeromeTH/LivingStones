# Generated by Django 5.0.6 on 2024-05-23 12:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_games', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(related_name='joined_games', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Monster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('blood_level', models.IntegerField()),
                ('game', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='livingstonesapp.game')),
            ],
        ),
        migrations.CreateModel(
            name='Attack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('damage', models.IntegerField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('attacker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attacks', to=settings.AUTH_USER_MODEL)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attack_history', to='livingstonesapp.game')),
                ('target', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='attacked_by', to='livingstonesapp.monster')),
            ],
            options={
                'indexes': [models.Index(fields=['game'], name='livingstone_game_id_24108f_idx'), models.Index(fields=['attacker'], name='livingstone_attacke_b19727_idx'), models.Index(fields=['target'], name='livingstone_target__ddb092_idx'), models.Index(fields=['timestamp'], name='livingstone_timesta_6087c7_idx')],
            },
        ),
    ]
