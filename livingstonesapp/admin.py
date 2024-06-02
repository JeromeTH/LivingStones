from django.contrib import admin
from .models import Game, NPC, GameNPC, GamePlayer


# Registering models with their respective admins

# class GameAdmin(admin.ModelAdmin):
#     list_display = ('id', 'creator', 'name', 'npc', 'start_time', 'end_time', 'is_active')
#     search_fields = ('name', 'creator__username', 'npc__name')
#     filter_horizontal = ('participants',)
#
#
# class NPCAdmin(admin.ModelAdmin):
#     list_display = ('name', 'current_blood')
#     search_fields = ('name',)

class GameNPCAdmin(admin.ModelAdmin):
    list_display = ('id', 'game', 'attr', 'current_blood')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game', 'attr')


class GamePlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'game', 'user', 'total_damage')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game', 'user')


admin.site.register(Game)
admin.site.register(NPC)
admin.site.register(GameNPC, GameNPCAdmin)
admin.site.register(GamePlayer, GamePlayerAdmin)
