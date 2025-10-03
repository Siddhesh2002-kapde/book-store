import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function HomeCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/books-store/categories/");
        const data = await res.json();
        setCategories(data.slice(0, 9)); // Only first 9 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-400 text-lg mt-12 animate-pulse">
        Loading categories...
      </p>
    );

  const handleCategoryClick = (categoryId) => {
    navigate(`/product-list?category=${categoryId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Explore Categories
      </h1>

      {/* Flex Row Container */}
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((category, index) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex-1 min-w-[250px] max-w-[280px] cursor-pointer relative 
              bg-white/10 backdrop-blur-xl border border-white/20 
              rounded-2xl shadow-lg hover:shadow-blue-500/40 
              hover:scale-105 transform transition-all duration-300 overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="relative p-6 flex flex-col items-start">
              <div className="text-blue-300 mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={36} />
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition">
                {category.name}
              </h2>
              <p className="text-gray-300 mt-2 text-sm group-hover:text-gray-100 transition">
                View books
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
