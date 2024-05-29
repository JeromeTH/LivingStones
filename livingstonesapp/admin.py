from django.contrib import admin
from .models import Game, NPC


# Registering models with their respective admins

# class GameAdmin(admin.ModelAdmin):
#     list_display = ('id', 'creator', 'name', 'npc', 'start_time', 'end_time', 'is_active')
#     search_fields = ('name', 'creator__username', 'npc__name')
#     filter_horizontal = ('participants',)
#
#
# class NPCAdmin(admin.ModelAdmin):
#     list_display = ('name', 'blood_level')
#     search_fields = ('name',)


admin.site.register(Game)
admin.site.register(NPC)
