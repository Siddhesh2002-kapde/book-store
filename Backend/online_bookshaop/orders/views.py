from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart, CartItem
from accounts.serializers import UserSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_data = UserSerializer(self.request.user).data
        is_admin = user_data.get("is_staff", False)
        if is_admin:
            return Order.objects.all()
        # Users can only see their own orders
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def place_order(self, request):
        """Place an order from the current user's cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response(
                {"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        total_price = sum(
            [item.book.price * item.quantity for item in cart.items.all()]
        )

        # Create Order
        order = Order.objects.create(user=request.user, total_price=total_price)

        # Create OrderItems
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                book=item.book,
                quantity=item.quantity,
                price=item.book.price,
            )

        # Clear the cart
        cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        """Admin can update order status"""
        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response(
                {"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        status_value = request.data.get("status")
        if status_value not in ["Pending", "Completed", "Cancelled"]:
            return Response(
                {"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )

        order.status = status_value
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
