import os
import django

# Set the environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'livingstones.settings'

# Initialize Django
django.setup()

from livingstonesapp.models import Game, GamePlayer, Attack
from livingstonesapp.serializers import GameSerializer, GamePlayerSerializer

player = GamePlayer.objects.first()
serializer = GamePlayerSerializer(player)

print(serializer.data)


game = Game.objects.first()
serializer = GameSerializer(game)
print(serializer.data)
