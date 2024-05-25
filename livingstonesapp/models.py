# models.py
from django.db import models
from django.contrib.auth.models import User


class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    participants = models.ManyToManyField(User, related_name='joined_games')
    name = models.CharField(max_length=255, null=True, blank=True)  # New field for game name
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Game {self.id} by {self.creator.username}"


class Monster(models.Model):
    game = models.OneToOneField(Game, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    blood_level = models.IntegerField()

    def __str__(self):
        return self.name


class Attack(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="attacks")
    attacker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attacks")
    target = models.ForeignKey(Monster, on_delete=models.CASCADE, related_name="attacked_by")
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
        return f"{self.attacker.username} attacked {self.damage} damage in Game {self.game.id}"