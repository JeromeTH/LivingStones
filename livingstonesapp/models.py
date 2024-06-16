# models.py
from django.db import models
from django.contrib.auth.models import User


class NPC(models.Model):
    name = models.CharField(max_length=100)
    total_blood = models.IntegerField(default=100)
    image = models.ImageField(upload_to='npc_images/', blank=True,
                              null=True)  # Images will be stored in media/npc_images/

    def __str__(self):
        return self.name


class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    name = models.CharField(max_length=255, null=True, blank=True)  # New field for game name
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # def delete(self, *args, **kwargs):
    #     # Ensure related objects are deleted first
    #     if hasattr(self, 'npc'):
    #         self.npc.delete()
    #     super().delete(*args, **kwargs)

    def __str__(self):
        return f"Name: {self.name} id: {self.id}"


class GameNPC(models.Model):
    game = models.OneToOneField(Game, on_delete=models.CASCADE, related_name='npc')
    attr = models.ForeignKey(NPC, on_delete=models.CASCADE)
    current_blood = models.IntegerField(blank=True, null=False)  # Make the field optional
    # You can add more fields if needed to track NPC state in the game

    def save(self, *args, **kwargs):
        if not self.pk and self.current_blood is None:
            # Set default blood level basedon the NPC's total blood level when first created (when it does not have pk)
            self.current_blood = self.attr.total_blood
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.attr.name} in Game {self.game.id}"


class GamePlayer(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='players')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_damage = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['game']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Player {self.id} in Game {self.game.id}"


class Attack(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="attacks")
    attacker = models.ForeignKey(GamePlayer, on_delete=models.CASCADE, related_name="attacks")
    target = models.ForeignKey(GameNPC, on_delete=models.CASCADE, related_name="attacked_by")
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
