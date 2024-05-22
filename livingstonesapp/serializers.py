# serializers.py
from rest_framework import serializers
from .models import Game, Monster, Attack


class MonsterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = '__all__'


class AttackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attack
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    monster = MonsterSerializer()
    attacks = AttackSerializer(many=True, read_only=True)
    participants = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'creator', 'participants', 'start_time', 'end_time', 'is_active', 'monster', 'attacks']
