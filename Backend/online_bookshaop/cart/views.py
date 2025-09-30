from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from bookstore.models import Book
from .serializers import CartSerializer, CartItemSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Each user can only see their own cart
        return Cart.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add a book to the cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.validated_data['book']
            quantity = serializer.validated_data.get('quantity', 1)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book)
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
            cart_item.save()
            return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        """Update quantity of a cart item"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            cart_item = CartItem.objects.get(pk=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CartSerializer(cart).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        """Remove a book from the cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            cart_item = CartItem.objects.get(pk=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response(CartSerializer(cart).data)
