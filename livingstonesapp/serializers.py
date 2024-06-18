# serializers.py
from rest_framework import serializers
from .models import Game, Attack, GamePlayer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'total_blood', 'attack_power']


class GamePlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = GamePlayer
        fields = ['id', 'game', 'user', 'total_damage', 'current_blood', 'created_at', 'defend_mode', 'boss_mode']


class AttackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attack
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    # attacks = AttackSerializer(many=True, read_only=True)
    players = GamePlayerSerializer(many=True, read_only=True)
    boss = GamePlayerSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Game
        fields = ['id', 'name', 'creator', 'players', 'start_time', 'end_time', 'is_active', 'boss']
