import React, { useEffect, useState } from "react";

export default function TrendingBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/books-store/books/");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();

        const booksWithImage = data.filter((book) => book.cover_image);
        setBooks(booksWithImage.slice(0, 6));
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="py-24 bg-gray-950 text-white body-font">
      <div className="container px-5 mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
            📚 Trending Books
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-gray-400">
            Explore the latest popular books our readers love. Hover over each cover to see details.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-400">No trending books found.</p>
        ) : (
          <div className="flex flex-wrap -m-4">
            {books.map((book) => (
              <div key={book.id} className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src={book.cover_image}
                  />
                  <div className="px-8 py-10 relative z-10 w-full bg-gradient-to-t from-black/80 to-black/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col justify-end font-pro">
                    <h2 className="tracking-widest text-sm font-medium text-indigo-400 mb-1">
                      {book.author}
                    </h2>
                    <h1 className="text-lg font-bold text-white mb-3">
                      {book.title}
                    </h1>
                    <p className="leading-relaxed mb-4 text-gray-300">Price: ₹{book.price}</p>
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium">
                      Add to Cart
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
