# prod/views.py
from django.shortcuts import render
from .models import Category, Product
from django.http import JsonResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

import os
from django.conf import settings


def debug_static_files(request):
    static_root = settings.STATIC_ROOT
    static_dirs = settings.STATICFILES_DIRS
    sass_file = os.path.join(static_dirs[0], 'scss', 'main.scss')

    context = {
        'static_root': static_root,
        'static_dirs': static_dirs,
        'sass_file_exists': os.path.exists(sass_file),
        'sass_file_path': sass_file,
    }
    return render(request, 'debug.html', context)

def home(request):
    categories = Category.objects.all()
    return render(request, 'home.html', {'categories': categories})


def product_list(request):
    category_id = request.GET.get('category')
    page = request.GET.get('page', 1)
    limit = int(request.GET.get('limit', 10))  # Получаем значение лимита из запроса

    products = Product.objects.filter(category_id=category_id)
    paginator = Paginator(products, limit)  # Используем лимит для пагинации

    try:
        products_page = paginator.page(page)
    except PageNotAnInteger:
        products_page = paginator.page(1)
    except EmptyPage:
        return JsonResponse([], safe=False)

    data = [
        {
            'id': product.id,
            'name': product.name,
            'price': str(product.price),
            'image': product.image.url if product.image else ''
        }
        for product in products_page
    ]

    print(f"Category ID: {category_id}, Page: {page}, Limit: {limit}")
    print(f"Total Products: {products.count()}")
    print(f"Products on current page: {len(data)}")

    return JsonResponse(data, safe=False)
