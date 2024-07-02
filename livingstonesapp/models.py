# models.py
from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
import os
import uuid
from django.utils.text import slugify


def unique_filename(instance, filename):
    """
    Generate a unique filename using a slugified version of the original
    filename and a unique identifier.
    """
    base, ext = os.path.splitext(filename)
    # Generate a unique identifier
    unique_id = uuid.uuid4().hex[:8]
    # Create the new filename
    new_filename = f"{slugify(base)}_{unique_id}{ext}"
    return os.path.join('profile_images', new_filename)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total_blood = models.IntegerField(default=100)
    attack_power = models.IntegerField(default=10)
    image = models.ImageField(upload_to=unique_filename, blank=False, null=False, default='sample_images/ttlc.jpeg')

    def __str__(self):
        return f"{self.user.username}'s profile"


class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    name = models.CharField(max_length=255, null=True, blank=True)  # New field for game name
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Name: {self.name} id: {self.id}"


class GamePlayer(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='players')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    total_damage = models.IntegerField()
    current_blood = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    defend_mode = models.BooleanField(default=False)
    boss_mode = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['game']),
            models.Index(fields=['profile']),
            models.Index(fields=['created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.current_blood is None:
                # Set default blood level basedon the NPC's total blood level when first created (when it does not have pk)
                self.current_blood = self.profile.total_blood

        super().save(*args, **kwargs)

    def __str__(self):
        return f"GamePlayer {self.id}"


class Attack(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="attacks")
    attacker = models.ForeignKey(GamePlayer, on_delete=models.CASCADE, related_name="attacks")
    target = models.ForeignKey(GamePlayer, on_delete=models.CASCADE, related_name="attacked_by")
    damage = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['game']),
            models.Index(fields=['attacker']),
            models.Index(fields=['target']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"{self.attacker.user.username} attacked {self.damage} damage in Game {self.game.id}"
