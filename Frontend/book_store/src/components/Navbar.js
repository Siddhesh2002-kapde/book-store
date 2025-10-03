import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { AuthContext } from "../context/Auth";

const Navbar = () => {
  const { getCartCount } = useContext(CartContext);
  const { data, setData } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const isAdmin = data?.user?.is_staff;
  const isAuthenticated = data?.isAuthenticated;
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setData((prev) => ({ ...prev, isAuthenticated: false, user: null }));
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <img
              src="https://img.freepik.com/free-vector/gradient-bookstore-logo_23-2149332422.jpg"
              alt="BookStore Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            BookShop
          </h1>
        </Link>

        {/* Navbar Links */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Books always visible */}
          <Link
            to="/product-list"
            className="font-medium text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-500 transition-all"
          >
            Books
          </Link>

          {/* Admin Links */}
          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/product-form"
                className="font-medium text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-500 transition-all"
              >
                Add Books
              </Link>
              <Link
                to="/orders"
                className="font-medium text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-500 transition-all"
              >
                All Orders
              </Link>
            </>
          )}

          {/* Authentication Links */}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg font-medium text-gray-200 hover:text-blue-400 hover:bg-gray-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all text-white"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          )}

          {/* Cart always visible if authenticated */}
          {isAuthenticated && (
            <Link to="/cart" className="relative ml-4">
              <ShoppingCart className="text-gray-200 hover:text-blue-400 transition-colors" />
              <span className="bg-blue-500 absolute -top-2 -right-2 text-xs text-white font-bold px-2 py-1 rounded-full shadow-md">
                {getCartCount()}
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
