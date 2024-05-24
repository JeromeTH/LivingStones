"""
URL configuration for LivingStones project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('livingstonesapp/', include('livingstonesapp.urls')),
                  path('', TemplateView.as_view(template_name="index.html")),
                  path('login/', TemplateView.as_view(template_name='index.html')),
                  path('register/', TemplateView.as_view(template_name='index.html')),
                  path('create-game/', TemplateView.as_view(template_name='index.html')),
                  path('active-games/', TemplateView.as_view(template_name='index.html')),
                  path('archive/', TemplateView.as_view(template_name='index.html')),
                  path('game/<int:id>', TemplateView.as_view(template_name='index.html')),
                  path('game/<int:id>/join/', TemplateView.as_view(template_name='index.html')),
                  path('game/<int:id>/endgame/', TemplateView.as_view(template_name='index.html')),
                  path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
                  path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
