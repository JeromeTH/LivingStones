from rest_framework import viewsets
from .models import Monster, Blow
from .serializers import MonsterSerializer, BlowSerializer

class MonsterViewSet(viewsets.ModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer

class BlowViewSet(viewsets.ModelViewSet):
    queryset = Blow.objects.all()
    serializer_class = BlowSerializer
