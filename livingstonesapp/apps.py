from django.apps import AppConfig


class LivingstonesappConfig(AppConfig):
    name = 'livingstonesapp'

    def ready(self):
        import livingstonesapp.signals