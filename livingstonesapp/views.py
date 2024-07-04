from django.db.models import QuerySet
from django.utils import timezone
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
import io
from .models import Game, Attack, GamePlayer, Profile
from .serializers import GameSerializer, AttackSerializer, ProfileSerializer
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
        user = User.objects.select_related('profile').get(username=username)
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
        # login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)  # Add parsers for file uploads

    def get_queryset(self):
        queryset = Profile.objects.select_related('User')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        serializer = self.get_serializer(profile)
        data = serializer.data
        data['current_user_id'] = request.user.id
        return Response(data)

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def update(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        print("Request data: ", request.data)
        print("Files: ", request.FILES)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self):
        queryset = Game.objects.prefetch_related('players', 'players__profile', 'players__profile__user')
        return queryset

    # lookup_field = pk (default)
    @method_decorator(csrf_exempt, name='dispatch')
    def create(self, request, *args, **kwargs):
        creator = request.user
        data = request.data
        # Extract name and npc_id from request data
        game_name = data.get('name')
        game = Game.objects.create(creator=creator, name=game_name, is_active=True)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def retrieve(self, request, *args, **kwargs):
        game_id = kwargs.get('pk')
        game = get_object_or_404(self.get_queryset(), id=game_id)
        serializer = self.get_serializer(game)
        data = serializer.data
        data['current_user_id'] = request.user.id
        print(request.user)
        return Response(data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        games = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(games, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def ended(self, request):
        games = self.get_queryset().filter(is_active=False)
        serializer = self.get_serializer(games, many=True)
        return Response(serializer.data)

    # @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        game = self.get_object()
        user = User.objects.select_related('profile').get(pk=request.user.pk)
        name = user.username
        player, created = GamePlayer.objects.get_or_create(
            game=game,
            profile=user.profile,
            defaults={'name': name, 'total_damage': 0, 'current_blood': user.profile.total_blood}
        )
        game.save()
        return Response({'status': 'joined'}, status=status.HTTP_200_OK)

    # @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    @action(detail=True, methods=['post'])
    def attack(self, request, pk=None):
        game = self.get_object()
        damage = int(request.data.get('damage'))
        target_ids = request.data.get('targets', [])
        attacker = game.players.filter(profile__user=request.user).first()

        if not target_ids:
            return Response({'error': 'No targets specified'}, status=400)

        print(target_ids)
        print(damage)
        for target_id in target_ids:
            target = GamePlayer.objects.get(id=target_id, game=game)
            actual_damage = min(damage, target.current_blood)
            Attack.objects.create(game=game, attacker=attacker, target=target, damage=actual_damage)
            attacker.total_damage += actual_damage
            target.current_blood -= actual_damage
            if target.current_blood <= 0:
                target.current_blood = 0
            print(target.current_blood)
            target.save()
            # when attacking oneself
            if attacker.id == target.id: attacker.current_blood = target.current_blood
        attacker.save()

        # Refresh game state
        game.save()
        return Response({
            'status': 'attacked',
            'is_active': game.is_active,
            'end_time': game.end_time if game.is_active is False else None,
        })

    @action(detail=True, methods=['post'])
    def heal(self, request, pk=None):
        game = self.get_object()
        healing = int(request.data.get('healing'))
        print(request.user)
        player = game.players.filter(profile__user=request.user).first()
        player.current_blood += healing
        player.save()

        # Refresh game state
        game.save()
        return Response({
            'status': 'healed',
            'is_active': game.is_active,
            'end_time': game.end_time if game.is_active is False else None,
        })

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def summary(self, request, *args, **kwargs):
        game_id = kwargs.get('pk')
        game = get_object_or_404(self.get_queryset(), id=game_id)
        players = set()
        for player in game.players.select_related('user').all():
            user = player.user.username
            players.add(user)
        response_data = {
            'leaderboard': self.calculate_leaderboard(game),
            'participants': list(players),
        }
        return Response(response_data, status=status.HTTP_200_OK)
