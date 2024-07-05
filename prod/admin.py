from django.contrib import admin
from .models import Category, Product, Documentation


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent']
    list_filter = ['parent']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category']
    list_filter = ['category']
    search_fields = ['name', 'description']
    filter_horizontal = ['documentation']


@admin.register(Documentation)
class DocumentationAdmin(admin.ModelAdmin):
    list_display = ['uploaded_at']
    search_fields = ['products__name']
