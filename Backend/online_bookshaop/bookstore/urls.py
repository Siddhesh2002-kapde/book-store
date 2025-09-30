from django.urls import path, include
from rest_framework.routers import DefaultRouter
from bookstore.views import *

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename="categories")
router.register(r'books', BookViewSet, basename="products")

urlpatterns = [
    path('', include(router.urls)),
]