# Generated by Django 5.0.6 on 2024-06-18 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livingstonesapp', '0002_remove_gameplayer_livingstone_user_id_d3abbe_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameplayer',
            name='name',
            field=models.CharField(default='Unknown', max_length=100),
        ),
    ]