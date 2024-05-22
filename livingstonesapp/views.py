from django.utils import timezone
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
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
        data = {"userName": username, "status": "Authenticated"}
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


@csrf_exempt
def create_game(request):
    if request.method == 'POST':
        creator = request.user
        data = json.loads(request.body)
        monster_data = data.pop('monster')
        game = Game.objects.create(creator=creator, **data)
        Monster.objects.create(game=game, **monster_data)
        return JsonResponse({'id': game.id}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def create(self, request, *args, **kwargs):
        creator = request.user
        monster_data = request.data.pop('monster')
        game = Game.objects.create(creator=creator, **request.data)
        Monster.objects.create(game=game, **monster_data)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        game = self.get_object()
        if request.user not in game.participants.all():
            game.participants.add(request.user)
        return Response({'status': 'joined'})

    @action(detail=True, methods=['post'])
    def attack(self, request, pk=None):
        game = self.get_object()
        damage = request.data.get('damage')
        attacker = request.user
        Attack.objects.create(game=game, attacker=attacker, damage=damage)
        game.monster.blood_level -= damage
        if game.monster.blood_level <= 0:
            game.monster.blood_level = 0
            game.is_active = False
            game.end_time = timezone.now()
        game.monster.save()
        game.save()
        return Response({'status': 'attacked'})
