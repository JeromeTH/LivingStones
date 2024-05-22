from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views
app_name = 'livingstonesapp'
urlpatterns = [
                  # # path for registration
                  path(route='register', view=views.registration, name='register'),
                  # path for login
                  # path(route='login', view=views.login_user, name='login'),
                  path(route='login', view=views.login_user, name='login'),
                  path(route='logout', view=views.logout_request, name='logout')
                  # path for add a review view
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
