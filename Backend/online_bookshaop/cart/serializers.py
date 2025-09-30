from rest_framework import serializers
from .models import Cart, CartItem
from bookstore.models import Book
from bookstore.serializers import BookSerializer

class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_id', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.book.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']

    def get_total_price(self, obj):
        return sum([item.book.price * item.quantity for item in obj.items.all()])
