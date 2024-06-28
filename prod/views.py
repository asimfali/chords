from django.shortcuts import render
from .models import Category, Product


def home(request):
    categories = Category.objects.filter(parent=None)
    products = Product.objects.all()
    return render(request, 'home.html', {'categories': categories, 'products': products})
