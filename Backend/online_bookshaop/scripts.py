import os
import django
import requests
from django.core.files.base import ContentFile

# --- Setup Django environment ---
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "online_bookshaop.settings")
django.setup()

from bookstore.models import Book, Category

# --- Function to fetch and save book ---
def fetch_and_save_book_by_isbn(isbn, category_obj):
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    resp = requests.get(url)
    data = resp.json()
    key = f"ISBN:{isbn}"
    if key not in data:
        print(f"ISBN {isbn} not found")
        return None
    book_data = data[key]

    title = book_data.get("title", "No Title")
    authors = book_data.get("authors", [])
    author_name = authors[0]["name"] if authors else "Unknown"
    description = book_data.get("publishers", [])
    description_text = ", ".join([pub["name"] for pub in description]) if description else ""
    
    # cover image
    cover = book_data.get("cover", {}).get("large") or book_data.get("cover", {}).get("medium")

    # Create or update Book
    book, created = Book.objects.get_or_create(isbn=isbn, defaults={
        "title": title,
        "author": author_name,
        "description": description_text,
        "category": category_obj,
        "price": 299.00  # default price
    })

    # Download cover if exists
    if cover and not book.cover_image:
        image_resp = requests.get(cover)
        if image_resp.status_code == 200:
            book.cover_image.save(f"{isbn}.jpg", ContentFile(image_resp.content), save=False)
    
    book.save()
    print(f"{'Created' if created else 'Updated'} book: {title}")
    return book

# --- Main function to run ---
def run():
    # Fetch existing categories by name
    try:
        fiction = Category.objects.get(name="Fiction")
        science = Category.objects.get(name="Non-Fiction")
        history = Category.objects.get(name="Academic")
    except Category.DoesNotExist as e:
        print(f"Category not found: {e}")
        return

    # List of ISBNs with category mapping
    books_to_fetch = [
        ("9780743273565", fiction),  # The Great Gatsby
        ("9780061120084", fiction),  # To Kill a Mockingbird
        ("9780451524935", fiction),  # 1984
        ("9780553380163", science),  # A Brief History of Time
        ("9780198788607", science),  # The Selfish Gene
        ("9780099590088", history),  # Sapiens
        ("9780393317558", history),  # Guns, Germs, and Steel
    ]

    for isbn, category_obj in books_to_fetch:
        fetch_and_save_book_by_isbn(isbn, category_obj)

# --- Execute ---
if __name__ == "__main__":
    run()
