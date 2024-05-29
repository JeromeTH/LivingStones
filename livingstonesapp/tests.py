from django.test import TestCase
from django.contrib.auth.models import User
from .models import Game, NPC


class NPCModelTest(TestCase):

    def setUp(self):
        # Create a user for the test
        self.user = User.objects.create_user(username='testuser', password='password')
        # Create a game instance
        self.game = Game.objects.create(creator=self.user)

    def test_create_npc(self):
        # Create a npc instance
        npc = NPC.objects.create(game=self.game, name='Dragon', current_blood=100)

        # Assertions to check if the npc was created successfully
        self.assertEqual(npc.name, 'Dragon')
        self.assertEqual(npc.current_blood, 100)
        self.assertEqual(npc.game, self.game)
        self.assertIsInstance(npc, NPC)

    def test_npc_str(self):
        # Create a npc instance
        npc = NPC.objects.create(game=self.game, name='Goblin', current_blood=50)

        # Assertion to check the __str__ method
        self.assertEqual(str(npc), 'Goblin')
