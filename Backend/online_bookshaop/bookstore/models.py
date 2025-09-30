# bookstore/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    isbn = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.title