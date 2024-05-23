from django.utils import timezone
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import Game, Monster, Attack
from .serializers import GameSerializer, MonsterSerializer, AttackSerializer
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
import logging
import json
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required

# Get an instance of a logger
logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        data = {"userName": username, "status": "Authenticated", "access": access_token}

    return JsonResponse(data)


# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    context = {}
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))
    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name,
                                        password=password, email=email)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


class MonsterViewSet(viewsets.ModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    # lookup_field = pk (default)
    @method_decorator(csrf_exempt, name='dispatch')
    def create(self, request, *args, **kwargs):
        creator = request.user
        monster_data = request.data.pop('monster')
        game = Game.objects.create(creator=creator, **request.data)
        Monster.objects.create(game=game, **monster_data)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        game = self.get_object()  # This method uses the pk to query the database and retrieve the specific Game object.
        serializer = self.get_serializer(game)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        games = Game.objects.filter(is_active=True)
        serializer = self.get_serializer(games, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        game = self.get_object()
        user = request.user
        if user not in game.participants.all():
            game.participants.add(user)
        game.save()
        return Response({'status': 'joined'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def attack(self, request, pk=None):
        game = self.get_object()
        damage = int(request.data.get('damage'))
        attacker = request.user
        target = game.monster
        Attack.objects.create(game=game, attacker=attacker, target=target, damage=damage)
        game.monster.blood_level -= damage
        if game.monster.blood_level <= 0:
            game.monster.blood_level = 0
            game.is_active = False
            game.end_time = timezone.now()
        game.monster.save()
        game.save()
        return Response({
            'status': 'attacked',
            'blood_level': game.monster.blood_level,
            'game_active': game.is_active,
            'end_time': game.end_time if game.is_active is False else None
        })

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def leaderboard(self, request, pk=None, ):
        game = self.get_object()
        attacks = Attack.objects.filter(game=game)

        leaderboard = {}
        for attack in attacks:
            user = attack.attacker.username
            if user in leaderboard:
                leaderboard[user] += attack.damage
            else:
                leaderboard[user] = attack.damage

        sorted_leaderboard = sorted(leaderboard.items(), key=lambda item: item[1], reverse=True)

        response_data = {
            'leaderboard': sorted_leaderboard
        }

        return Response(response_data)

    @action(detail=True, methods=['post'])
    def end_game(self, request, pk=None):
        game = self.get_object()
        Attack.objects.filter(game=game).delete()
        game.delete()
        return Response({'status': 'game deleted'})
