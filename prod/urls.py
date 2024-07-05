from django.urls import path
from . import views

app_name = 'prod'

urlpatterns = [
    path('', views.home, name='home'),
    path('api/products/', views.product_list, name='product_list'),
]
