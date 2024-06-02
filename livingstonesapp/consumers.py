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
        data = json
        current_blood = data['current_blood']
        is_active = data.get('is_active', True)
        leaderboard = data['leaderboard']

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'update_current_blood',
                'current_blood': current_blood,
                'is_active': is_active,
                'leaderboard': leaderboard,
            }
        )
        return None

    async def update_current_blood(self, event):
        current_blood = event['current_blood']
        is_active = event['is_active']
        leaderboard = event['leaderboard']

        await self.send(text_data=json.dumps({
            'current_blood': current_blood,
            'is_active': is_active,
            'leaderboard': leaderboard,
        }))
