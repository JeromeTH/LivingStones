from django.contrib import admin
from .models import Game, Monster
# Registering models with their respective admins
admin.site.register(Game)
admin.site.register(Monster)