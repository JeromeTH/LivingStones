# serializers.py
from rest_framework import serializers
from .models import Game, Attack, GamePlayer, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class GamePlayerSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = GamePlayer
        fields = ['id', 'game', 'name', 'profile', 'total_damage', 'current_blood', 'created_at', 'defend_mode',
                  'boss_mode']


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
