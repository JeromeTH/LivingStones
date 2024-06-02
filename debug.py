import os
import django

# Set the environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'livingstones.settings'

# Initialize Django
django.setup()

from livingstonesapp.models import Game, GamePlayer, Attack
from livingstonesapp.serializers import GameSerializer, GamePlayerSerializer

game = Game.objects.select_related('npc').get(id=1)
game_serializer = GameSerializer(game)
print(game_serializer.data)
