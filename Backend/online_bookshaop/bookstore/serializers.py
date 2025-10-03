# bookstore/serializers.py
from rest_framework import serializers
from .models import Book, Category
import django_filters
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'
        

class BookFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.NumberFilter(field_name="category__id")
    author = django_filters.CharFilter(field_name="author", lookup_expr="icontains")

    class Meta:
        model = Book
        fields = ["category", "author", "price_min", "price_max"]