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
    cover_image = models.ImageField(upload_to='books/', null=True, blank=True)
    category = models.ForeignKey('Category',related_name='item', on_delete=models.CASCADE)
    publisher = models.CharField(max_length=100, null=True, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    language = models.CharField(max_length=50, default='English')
    pages = models.PositiveIntegerField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)  # for e-commerce
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    format = models.CharField(max_length=50, choices=[('Hardcover','Hardcover'), ('Paperback','Paperback'), ('Ebook','Ebook')], default='Paperback')
    def __str__(self):
        return self.title
