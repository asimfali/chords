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

    products = Product.objects.filter(category_id=category_id)
    paginator = Paginator(products, 10)  # 10 продуктов на страницу

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

    return JsonResponse(data, safe=False)