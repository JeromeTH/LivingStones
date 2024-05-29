# serializers.py
from rest_framework import serializers
from .models import Game, NPC, Attack


class NPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NPC
        fields = '__all__'


class AttackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attack
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    npc = NPCSerializer()
    attacks = AttackSerializer(many=True, read_only=True)
    participants = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'creator', 'participants', 'start_time', 'end_time', 'is_active', 'npc', 'attacks']
