import json
from channels.generic.websocket import AsyncWebsocketConsumer
from typing import Any, Coroutine
from asgiref.sync import sync_to_async


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data: Any = None, bytes_data: Any = None) -> None:
        game_state = await self.get_game_state(include_static=False)
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'game_update',
                'game': game_state
            }
        )
        return None

    async def game_update(self, event):
        game = event['game']
        await self.send(text_data=json.dumps(game))

    @sync_to_async
    def get_game_state(self, include_static=False):
        from .models import Game  # Lazy import within the function
        game = Game.objects.get(pk=self.game_id)
        game_players = game.players.select_related('profile').all()  # Select related profile for each player
        players = [
            {
                'id': player.id,
                'name': player.name,
                'total_damage': player.total_damage,
                'current_blood': player.current_blood,
                'defend_mode': player.defend_mode,
                'boss_mode': player.boss_mode,
                'profile': {
                    'image': player.profile.image.url if player.profile.image else None,
                    'total_blood': player.profile.total_blood
                }
            } for player in game_players
        ]
        game_state = {
            'is_active': game.is_active,
            'players': players
        }
        if include_static:
            game_state.update({
                'id': game.id,
                'name': game.name,
                'creator': game.creator.username,
                'start_time': game.start_time.isoformat(),
                'end_time': game.end_time.isoformat() if game.end_time else None,
            })
        return game_state
