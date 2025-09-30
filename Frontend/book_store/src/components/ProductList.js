import React, { useState, useEffect, useContext } from "react";
import { Search, Filter, ShoppingCart, BookOpen, Check } from "lucide-react";
import { AuthContext } from "../context/Auth";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function BookListPage() {
  const { data } = useContext(AuthContext);
  const { addToCart, cart, getCartCount } = useContext(CartContext);
  const isAdmin = data?.user?.is_staff;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [message, setMessage] = useState("");
  const [justAdded, setJustAdded] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/books-store/categories/"
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/books-store/books/");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Handle add to cart
  const handleAddToCart = async (book) => {
    setAddingToCart(book.id);

    const result = await addToCart(book);

    setAddingToCart(null);

    if (result.success) {
      setMessage(result.message);
      setJustAdded(book.id);

      // Clear success message after 2 seconds
      setTimeout(() => {
        setMessage("");
        setJustAdded(null);
      }, 2000);
    } else {
      setMessage(result.message || "Failed to add to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/books-store/books/${bookId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        // Remove deleted book from state
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        setMessage("Book deleted successfully");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("Failed to delete book");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setMessage("Error deleting book");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Check if book is in cart
  const isInCart = (bookId) => {
    return cart.some((item) => item.book?.id === bookId);
  };

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || book.category == selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Message Banner */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 rounded-lg ${message.includes("Failed") || message.includes("Error")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            <div className="flex items-center">
              {!message.includes("Failed") && !message.includes("Error") && (
                <Check className="w-5 h-5 mr-2" />
              )}
              {message}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link
                to="/product-form"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <span className="hidden sm:inline">Add Book</span>
              </Link>
            )}
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredBooks.length}</span> book
            {filteredBooks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    {book.category_name}
                  </span>
                  {isInCart(book.id) && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      In Cart
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      ISBN: {book.isbn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-2xl font-bold text-blue-600">
                      ${(+book.price).toFixed(2)}
                    </span>
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Link to={`/edit-book/${book.id}`}>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(book)}
                        disabled={
                          addingToCart === book.id || justAdded === book.id
                        }
                        className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${justAdded === book.id
                            ? "bg-green-600 text-white"
                            : isInCart(book.id)
                              ? "bg-gray-600 text-white hover:bg-gray-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {addingToCart === book.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : justAdded === book.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added!
                          </>
                        ) : isInCart(book.id) ? (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add More
                          </>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
