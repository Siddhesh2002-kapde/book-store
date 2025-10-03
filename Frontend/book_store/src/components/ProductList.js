import React, { useState, useEffect, useContext } from "react";
import Particles from "react-tsparticles";
import { Search, ShoppingCart, BookOpen, Check } from "lucide-react";
import { AuthContext } from "../context/Auth";
import { CartContext } from "../context/CartContext";
import { useLocation, Link } from "react-router-dom";

export default function BookListPage() {
  const { data } = useContext(AuthContext);
  const { addToCart, cart } = useContext(CartContext);
  const isAdmin = data?.user?.is_staff;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromURL = searchParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [message, setMessage] = useState("");
  const [justAdded, setJustAdded] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBooks = await fetch("http://localhost:8000/api/books-store/books/");
        const dataBooks = await resBooks.json();
        setBooks(dataBooks);

        const resCategories = await fetch("http://localhost:8000/api/books-store/categories/");
        const dataCategories = await resCategories.json();
        setCategories(dataCategories);

        const uniqueAuthors = [...new Set(dataBooks.map((b) => b.author))];
        const uniqueLanguages = [...new Set(dataBooks.map((b) => b.language))];
        setAuthors(uniqueAuthors);
        setLanguages(uniqueLanguages);

        const prices = dataBooks.map((b) => +b.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryFromURL) setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  // Cart
  const handleAddToCart = async (book) => {
    setAddingToCart(book.id);
    const result = await addToCart(book);
    setAddingToCart(null);

    if (result.success) {
      setMessage(result.message);
      setJustAdded(book.id);
      setTimeout(() => {
        setMessage("");
        setJustAdded(null);
      }, 2000);
    } else {
      setMessage(result.message || "Failed to add to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const isInCart = (bookId) => cart.some((item) => item.book?.id === bookId);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/books-store/books/${bookId}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
        setMessage("Book deleted successfully");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("Failed to delete book");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting book");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Filtered books
  const filteredBooks = books
    .filter((book) => book.cover_image)
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) =>
      selectedCategory === "all" ||
      book.category === selectedCategory ||
      book.category_name === categories.find(c => c.id == selectedCategory)?.name
    )
    .filter((book) => +book.price >= priceRange[0] && +book.price <= priceRange[1])
    .filter((book) => (+book.rating || 0) >= minRating)
    .filter((book) =>
      selectedAuthors.length === 0 ||
      selectedAuthors.some(a => a.toLowerCase().trim() === (book.author || "").toLowerCase().trim())
    )
    .filter((book) =>
      selectedLanguages.length === 0 ||
      selectedLanguages.some(l => l.toLowerCase().trim() === (book.language || "").toLowerCase().trim())
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white relative scrollbar-hide top-15 overflow-hidden">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          particles: { number: { value: 60 }, color: { value: ["#60a5fa", "#c084fc", "#f472b6"] }, size: { value: 2 }, move: { speed: 1, outMode: "out" }, opacity: { value: 0.4 } }
        }}
      />

      {/* Main Flex Container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 scrollbar-hide overflow-hidden">
        {/* Sidebar Filters (Sticky) */}
        <aside className="w-64 flex-shrink-0 bg-gray-900 rounded-2xl p-6 space-y-6 sticky scrollbar-hide top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Filters</h2>

          {/* Search */}
          <div>
            <label className="text-gray-400 mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-white bg-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-400 mb-2 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-white bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-gray-400 mb-2 block">
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </label>
            <input
              type="range"
              min={Math.min(...books.map(b => +b.price))}
              max={Math.max(...books.map(b => +b.price))}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-gray-400 mb-2 block">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(+e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-white bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any</option>
              <option value={3}>3+ Stars</option>
              <option value={3.5}>3.5+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>

          {/* Authors */}
          <div>
            <label className="text-gray-400 mb-2 block">Authors</label>
            <select
              multiple
              value={selectedAuthors}
              onChange={(e) => setSelectedAuthors(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-2 rounded-xl text-white bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {authors.map((a, idx) => <option key={idx} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="text-gray-400 mb-2 block">Languages</label>
            <select
              multiple
              value={selectedLanguages}
              onChange={(e) => setSelectedLanguages(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-2 rounded-xl text-white bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((l, idx) => <option key={idx} value={l}>{l}</option>)}
            </select>
          </div>
        </aside>

        {/* Books List section (Scrollable only) */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide ">
          {selectedCategory !== "all" && (
            <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-2">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                {categories.find(c => c.id == selectedCategory)?.name || "Category"}
              </h2>
              <span className="text-sm text-gray-400">
                {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.length > 0 ? filteredBooks.map((book) => (
              <div key={book.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64 bg-gray-700">
                  <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-xl text-sm">{book.category_name}</span>
                  {isInCart(book.id) && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-xl text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      In Cart
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{book.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xl font-bold text-blue-400">${(+book.price).toFixed(2)}</span>
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Link to={`/edit-book/${book.id}`}><button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">Edit</button></Link>
                        <button onClick={() => handleDeleteBook(book.id)} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition">Delete</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(book)}
                        disabled={addingToCart === book.id || justAdded === book.id}
                        className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${justAdded === book.id ? "bg-green-600 text-white" : isInCart(book.id) ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {addingToCart === book.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : justAdded === book.id ? <Check className="w-4 h-4" /> : isInCart(book.id) ? <ShoppingCart className="w-4 h-4" /> : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 col-span-full">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No books found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur border-t border-white/10 py-6 text-center">
        <p className="text-gray-400">&copy; 2025 BookStore — Made with 💜 for readers</p>
      </footer>
    </div>
  );
}
