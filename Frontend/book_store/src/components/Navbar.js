import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { getCartCount } = useContext(CartContext);
  const { data, setData } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const isAdmin = data?.user?.is_staff;
  console.log(data);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    setData((prev) => {
      return {
        ...prev,
        isAuthenticated: false,
      };
    });
    navigate("/login"); // redirect
  };

  return (
    <nav className="relative z-10 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BookStore
            </h1>
          </div>

          {/* Menu */}
          <div className="flex items-center space-x-8">
            <ul className="flex space-x-8">
              {!isAdmin && (
                <Link to={"/cart"} className="relative">
                  <ShoppingCart />
                  <span className="bg-blue-600 absolute -top-4 -right-4 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {getCartCount()}
                  </span>{" "}
                </Link>
              )}
              {data.isAuthenticated &&
                (isAdmin
                  ? [
                      { name: "Books", href: "/product-list" },
                      { name: "Orders", href: "/orders" },
                    ]
                  : [
                      { name: "Books", href: "/product-list" },
                      { name: "Orders", href: "/orders" },
                    ]
                ).map((item, index) => (
                  <li
                    key={item.name}
                    className={`transform transition-all duration-300 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Link
                      to={item.href}
                      className="text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text font-medium transition-all duration-300 relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {!data.isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
