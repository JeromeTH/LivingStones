from django.db import models

class Monster(models.Model):
    name = models.CharField(max_length=100)
    blood_level = models.IntegerField(default=100)

class Blow(models.Model):
    monster = models.ForeignKey(Monster, on_delete=models.CASCADE)
    damage = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)