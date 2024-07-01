# prod/views.py
from django.shortcuts import render
from .models import Category, Product
from django.http import JsonResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


def home(request):
    categories = Category.objects.all()
    return render(request, 'home.html', {'categories': categories})


def product_list(request):
    category_id = request.GET.get('category')
    page = request.GET.get('page', 1)
    limit = int(request.GET.get('limit', 10))  # Получаем значение лимита из запроса

    # Проверим, что товары фильтруются по категории правильно
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

    # Добавим отладочные сообщения для проверки количества товаров и страниц
    print(f"Category ID: {category_id}, Page: {page}, Limit: {limit}")
    print(f"Total Products: {products.count()}")
    print(f"Products on current page: {len(data)}")

    return JsonResponse(data, safe=False)
