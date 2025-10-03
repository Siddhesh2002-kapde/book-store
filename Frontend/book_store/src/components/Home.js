import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import TrendingBooks from "./TrendingBooks";
import HomeCategories from "./HomeCategories";
import BookHighlights from "./BookHighlights";

// Featured Authors Component
const FeaturedAuthors = () => {
  const authors = [
    { name: "J.K. Rowling", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "George R.R. Martin", img: "https://randomuser.me/api/portraits/men/65.jpg" },
    { name: "Agatha Christie", img: "https://randomuser.me/api/portraits/women/69.jpg" },
    { name: "Stephen King", img: "https://randomuser.me/api/portraits/men/70.jpg" },
  ];
  return (
    <section className="py-16 bg-gray-900 text-white text-center">
      <h2 className="text-3xl font-bold mb-10">Featured Authors</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {authors.map((author) => (
          <div key={author.name} className="flex flex-col items-center">
            <img
              className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
              src={author.img}
              alt={author.name}
            />
            <h3 className="text-xl font-semibold">{author.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const reviews = [
    { name: "Alice", text: "BookStore has completely transformed my reading habits! Amazing collection." },
    { name: "Bob", text: "The interface is so smooth and easy to navigate. Highly recommended!" },
    { name: "Charlie", text: "I found every book I wanted in one place. A true reader's paradise." },
  ];
  return (
    <section className="py-16 bg-gray-950 text-gray-300 text-center">
      <h2 className="text-3xl font-bold mb-10 text-white">What Our Readers Say</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-xl w-80 shadow-lg hover:scale-105 transform transition"
          >
            <p className="mb-4">"{r.text}"</p>
            <h3 className="font-semibold text-white">- {r.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

// Newsletter Signup Component
const NewsletterSignup = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="mb-6">Get updates on new arrivals, discounts, and exclusive offers.</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 rounded-l-xl w-64 text-gray-900 focus:outline-none"
        />
        <button className="p-3 rounded-r-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition">
          Subscribe
        </button>
      </div>
    </section>
  );
};

// FAQ Component
const FAQ = () => {
  const faqs = [
    { q: "How can I buy a book?", a: "You can explore books and click 'Add to Cart' to purchase." },
    { q: "Do you ship internationally?", a: "Yes! We deliver books worldwide." },
    { q: "Can I return a book?", a: "Absolutely! Returns are available within 30 days of purchase." },
  ];
  return (
    <section className="py-16 bg-gray-900 text-white text-center">
      <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
      <div className="flex flex-col items-center gap-6">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="w-4/5 md:w-2/5 text-left bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition"
          >
            <h3 className="font-semibold mb-2">{f.q}</h3>
            <p className="text-gray-300">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      <div className="container mx-auto px-5 py-12 flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Branding */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
            BookStore
          </h1>
          <p className="text-gray-400 mt-2">Your one-stop destination for books across all genres.</p>
        </div>
        {/* Links */}
        <div className="flex flex-wrap gap-8">
          <div>
            <h2 className="font-semibold mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Resources</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-pink-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-pink-400 transition">Ebooks</a></li>
              <li><a href="#" className="hover:text-pink-400 transition">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Follow Us</h2>
            <div className="flex gap-3 mt-1">
              <a href="#" className="hover:text-blue-400 transition">FB</a>
              <a href="#" className="hover:text-blue-400 transition">TW</a>
              <a href="#" className="hover:text-pink-400 transition">IG</a>
              <a href="#" className="hover:text-purple-400 transition">LI</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 text-gray-400 text-center py-4 border-t border-gray-800">
        © 2025 BookStore — All Rights Reserved
      </div>
    </footer>
  );
};

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Carousel Images
  const heroImages = [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80"
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroImages.length);
    }, 5000); // change every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-x-hidden">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          particles: {
            number: { value: 60 },
            color: { value: ["#60a5fa", "#c084fc", "#f472b6"] },
            size: { value: 2 },
            move: { speed: 1, outMode: "out" },
            opacity: { value: 0.4 },
          },
        }}
      />

      {/* Hero Section with Background Carousel */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center px-6 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImages[currentHero]})` }}
      >
        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 transition-all duration-1000">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-white">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Discover Your Next Adventure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Unlock thousands of stories, from timeless classics to the latest bestsellers — all in one place.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/books")}
              className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all"
            >
              Explore Books
            </button>
            <button className="px-8 py-4 rounded-2xl font-semibold bg-white/10 backdrop-blur border border-white/20 hover:border-blue-400 hover:scale-105 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Categories + Trending */}
      <HomeCategories />
      <BookHighlights />

      {/* New Sections */}
      <FeaturedAuthors />
      <Testimonials />
      <NewsletterSignup />
      <FAQ />

      {/* Floating Explore Button */}
      {scrollY > 200 && (
        <button
          onClick={() => navigate("/product-list")}
          className="fixed bottom-10 right-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-full shadow-xl hover:scale-110 transition-transform z-50"
        >
          Explore Books
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
