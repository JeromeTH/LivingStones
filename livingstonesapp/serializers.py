from rest_framework import serializers
from .models import Monster, Blow

class MonsterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = '__all__'

class BlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blow
        fields = '__all__'