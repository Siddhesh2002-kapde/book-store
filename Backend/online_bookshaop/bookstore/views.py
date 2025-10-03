# bookstore/views.py
from rest_framework import viewsets,status
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer,BookFilter
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # permission_classes = [IsAdminUser]  
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter
    renderer_classes = [JSONRenderer]


    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False,methods=["get"],permission_classes = [AllowAny])
    def author_wise_books(self,request,*args,**kwargs):
        books = Book.objects.distinct('author')
        serializer = self.get_serializer(books,many= True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    

    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data = request.data,many = isinstance(request.data,list))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
