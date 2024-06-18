from django.contrib import admin
from .models import Game, GamePlayer, Profile
from django.urls import path
from django.shortcuts import get_object_or_404, render, redirect


# Registering models with their respective admins

class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

    # def get_queryset(self, request):
    #     # Use select_related to fetch related objects in a single query
    #     qs = super().get_queryset(request)
    #     return qs.select_related('npc', 'npc__attr')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<path:object_id>/delete/', self.admin_site.admin_view(self.custom_delete_view), name='game_delete'),
        ]
        return custom_urls + urls

    @staticmethod
    def custom_delete_view(self, object_id, extra_context=None):
        # Perform the deletion directly
        Game.objects.filter(id=object_id).delete()
        return redirect('/admin/livingstonesapp/game/')


class GamePlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'game', 'profile', 'total_damage', 'current_blood')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game', 'profile')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<path:object_id>/delete/', self.admin_site.admin_view(self.custom_delete_view),
                 name='gameplayer_delete'),
        ]
        return custom_urls + urls

    @staticmethod
    def custom_delete_view(self, object_id, extra_context=None):
        # Perform the deletion directly
        GamePlayer.objects.filter(id=object_id).delete()
        return redirect('/admin/livingstonesapp/gameplayer/')

class ProfileAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')


admin.site.register(Game, GameAdmin)
admin.site.register(GamePlayer, GamePlayerAdmin)
admin.site.register(Profile, ProfileAdmin)
