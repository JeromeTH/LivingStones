# serializers.py
from rest_framework import serializers
from .models import Game, NPC, Attack, GameNPC, GamePlayer


class NPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NPC
        fields = '__all__'


class GameNPCSerializer(serializers.ModelSerializer):
    attr = NPCSerializer(read_only=True)  # Include nested NPC details

    class Meta:
        model = GameNPC
        fields = ['id', 'game', 'attr', 'current_blood']


class GamePlayerSerializer(serializers.ModelSerializer):

    class Meta:
        model = GamePlayer
        fields = '__all__'


class AttackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attack
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    npc = GameNPCSerializer(many=False, read_only=True)
    attacks = AttackSerializer(many=True, read_only=True)
    players = GamePlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'name', 'creator', 'players', 'start_time', 'end_time', 'is_active', 'npc', 'attacks']
