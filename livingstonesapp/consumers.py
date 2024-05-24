import json
from channels.generic.websocket import AsyncWebsocketConsumer
from typing import Any, Coroutine


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
        data = json.loads(text_data)
        blood_level = data['blood_level']
        is_active = data.get('is_active', True)

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'update_blood_level',
                'blood_level': blood_level,
                'is_active': is_active,

            }
        )
        return None

    async def update_blood_level(self, event):
        blood_level = event['blood_level']
        is_active = event['is_active']

        await self.send(text_data=json.dumps({
            'blood_level': blood_level,
            'is_active': is_active
        }))
