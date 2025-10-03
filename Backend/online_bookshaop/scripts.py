# fetch_books.py
import os
import django
import requests
from django.core.files.base import ContentFile
from datetime import datetime
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_bookshaop.settings')
django.setup()

from bookstore.models import Book, Category

def safe_print(text):
    """Prints text safely, ignoring Unicode characters that can't be displayed in console."""
    print(text.encode('utf-8', errors='ignore').decode('utf-8'))

def fetch_books():
    categories_map = {
        "fiction": "Fiction",
        "nonfiction": "Non-Fiction",
        "academic": "Academic",
        "science": "Science",
        "history": "History",
        "fantasy": "Fantasy",
        "biography": "Biography",
        "mystery": "Mystery",
    }

    for subject, category_name in categories_map.items():
        category, created = Category.objects.get_or_create(name=category_name)
        if created:
            safe_print(f"Created category: {category_name}")

        url = f"https://openlibrary.org/subjects/{subject}.json?limit=10"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            safe_print(f"Failed to fetch books for {subject}: {e}")
            continue

        for book_data in data.get("works", []):
            title = book_data.get("title")
            authors = ", ".join([a['name'] for a in book_data.get("authors", [])])
            isbn = book_data.get("cover_edition_key", None)

            # Avoid duplicates
            if isbn and Book.objects.filter(isbn=isbn).exists():
                continue

            description = book_data.get("description", "")
            if isinstance(description, dict):
                description = description.get("value", "")

            # Skip book if no cover image
            if not isbn:
                safe_print(f"Skipping '{title}' - no cover image available")
                continue

            # Cover image
            cover_image = None
            image_url = f"https://covers.openlibrary.org/b/olid/{isbn}-M.jpg"
            try:
                img_response = requests.get(image_url)
                img_response.raise_for_status()
                cover_image = ContentFile(img_response.content, name=f"{isbn}.jpg")
            except requests.RequestException:
                safe_print(f"Skipping '{title}' - failed to download cover image")
                continue

            # Additional details
            publisher = book_data.get("publishers", ["Unknown"])[0] if book_data.get("publishers") else "Unknown"
            
            publication_date = None
            first_publish_year = book_data.get("first_publish_year")
            if first_publish_year:
                try:
                    publication_date = datetime(first_publish_year, 1, 1).date()
                except:
                    publication_date = None

            pages = book_data.get("number_of_pages_median") or None

            language = "English"
            if book_data.get("languages"):
                lang_codes = [l['key'].split('/')[-1] for l in book_data.get("languages")]
                language = lang_codes[0].capitalize() if lang_codes else "English"

            # Random rating, price, and stock
            rating = round(random.uniform(3.0, 5.0), 2)
            price = random.randint(100, 500)
            stock = random.randint(5, 20)

            # Truncate strings to avoid database errors
            title = title[:200] if title else "No Title"
            authors = (authors or "Unknown")[:100]
            publisher = (publisher or "Unknown")[:100]

            # Create book
            Book.objects.create(
                title=title,
                author=authors,
                price=price,
                isbn=isbn or title[:20],
                description=description or "No description available",
                category=category,
                cover_image=cover_image,
                publisher=publisher,
                publication_date=publication_date,
                language=language,
                pages=pages,
                stock=stock,
                rating=rating,
                format="Paperback"
            )
            safe_print(f"Added book: {title}")

    safe_print("Finished fetching books with cover images!")

if __name__ == "__main__":
    fetch_books()
