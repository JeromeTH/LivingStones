from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView

app_name = 'livingstonesapp'
urlpatterns = [
                  # # path for registration
                  path(route='register', view=views.registration, name='register'),
                  # path for login
                  # path(route='login', view=views.login_user, name='login'),
                  path(route='login', view=views.login_user, name='login'),
                  path(route='logout', view=views.logout_request, name='logout'),
                  path(route='create-game', view=views.GameViewSet.as_view({'post': 'create'}), name='create-game'),
                  path('active-games/', views.GameViewSet.as_view({'get': 'active'}), name='active-games'),
                  path('ended-games/', views.GameViewSet.as_view({'get': 'ended'}), name='ended-games'),
                  path('profile/', views.ProfileViewSet.as_view({'get': 'retrieve'}), name='profile'),
                  path('profile/update/', views.ProfileViewSet.as_view({'put': 'update'}), name='profile-update'),
                  path('game/<int:pk>/', views.GameViewSet.as_view({'get': 'retrieve'}), name='game-detail'),
                  path('game/<int:pk>/join/', views.GameViewSet.as_view({'post': 'join'}), name='game-join'),
                  path('game/<int:pk>/attack/', views.GameViewSet.as_view({'post': 'attack'}), name='game-attack'),
                  path('game/<int:pk>/heal/', views.GameViewSet.as_view({'post': 'heal'}), name='game-heal'),
                  path('game/<int:pk>/summary/', views.GameViewSet.as_view({'get': 'summary'}),
                       name='game-summary'),
                  path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

                  # path(route='create-game', view=views.create_game, name='create-game')
                  # path for add a review view
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
