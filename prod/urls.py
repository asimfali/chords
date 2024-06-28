from django.urls import path
from . import views

app_name = 'prod'

urlpatterns = [
    path('', views.home, name='home'),
]
