from django.test import TestCase
from django.contrib.auth.models import User
from .models import Game, Monster


class MonsterModelTest(TestCase):

    def setUp(self):
        # Create a user for the test
        self.user = User.objects.create_user(username='testuser', password='password')
        # Create a game instance
        self.game = Game.objects.create(creator=self.user)

    def test_create_monster(self):
        # Create a monster instance
        monster = Monster.objects.create(game=self.game, name='Dragon', blood_level=100)

        # Assertions to check if the monster was created successfully
        self.assertEqual(monster.name, 'Dragon')
        self.assertEqual(monster.blood_level, 100)
        self.assertEqual(monster.game, self.game)
        self.assertIsInstance(monster, Monster)

    def test_monster_str(self):
        # Create a monster instance
        monster = Monster.objects.create(game=self.game, name='Goblin', blood_level=50)

        # Assertion to check the __str__ method
        self.assertEqual(str(monster), 'Goblin')
