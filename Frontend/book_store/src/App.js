import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgetPass";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductFrom";
import { AuthContext } from "./context/Auth";
import EditBook from "./components/EditBook";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import Orders from "./components/Orders";
import ScratchCardOTP from "./components/ScratchCardOTP";
import EnterOTP from "./components/EnterOTP";

function App() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    user: null,
    isAuthenticated: false,
  });

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch(
        "http://localhost:8000/api/accounts/users/verify_token/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const result = await response.json();
      return result; // should contain user info if valid
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await verifyToken();
        setData({
          user: userData.user,
          isAuthenticated: !!userData,
        });
        if (!userData) localStorage.removeItem("token");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ data, setData }}>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/password_reset_request_otp"
              element={<ResetPassword />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/scratch-card" element={<ScratchCardOTP />} />
            <Route path="/enter-otp" element={<EnterOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
