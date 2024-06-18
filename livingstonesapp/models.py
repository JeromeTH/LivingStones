# models.py
from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total_blood = models.IntegerField(default=100)
    attack_power = models.IntegerField(default=10)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


# Signal to create or update Profile whenever User is created or updated
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()


class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_games')
    name = models.CharField(max_length=255, null=True, blank=True)  # New field for game name
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    boss = models.OneToOneField('GamePlayer', null=True, blank=True, on_delete=models.SET_NULL,
                                related_name='boss_of_game')

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
            if self.name is None:
                self.name = self.profile.user.username

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Player {self.id} in Game {self.game.id}"


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
