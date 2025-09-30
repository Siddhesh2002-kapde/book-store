import React, { useState, useContext } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    fetchCart,
  } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleUpdateQuantity = async (cartItemId, change) => {
    const item = cart.find((item) => item.id === cartItemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    setActionLoading(true);
    const result = await updateQuantity(cartItemId, newQuantity);
    setActionLoading(false);

    if (!result.success) {
      setMessage(result.message || "Error updating quantity");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setActionLoading(true);
    const result = await removeFromCart(cartItemId);
    setActionLoading(false);

    if (result.success) {
      setMessage(result.message || "Item removed");
    } else {
      setMessage(result.message || "Error removing item");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to place an order.");
        return;
      }

      // Prepare order payload
      const payload = {
        items: cart.map((item) => ({
          book_id: item.id,
          quantity: item.quantity || 1, // default to 1 if not set
        })),
      };

      const response = await fetch(
        "http://localhost:8000/api/orders/orders/place_order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      if (response.status === 201) {
        await fetchCart();
        navigate("/orders");
      }
      const data = await response.json();
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong while placing your order.");
    }
  };

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Continue Shopping</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              {getCartCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Message Banner */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 rounded-lg ${
              message.includes("Error") ||
              message.includes("Invalid") ||
              message.includes("Failed")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">Add some books to get started!</p>
            <Link
              to="/product-list"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Cart Items ({cart.length})
                </h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.book?.cover_image ||
                            "https://via.placeholder.com/150x200?text=No+Image"
                          }
                          alt={item.book?.title || "Book"}
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.book?.title || "Untitled"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          by {item.book?.author || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          ISBN: {item.book?.isbn || "N/A"}
                        </p>
                        {item.book?.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {typeof item.book.category === "object"
                              ? item.book.category.name
                              : item.book.category}
                          </span>
                        )}

                        {/* Mobile Price & Controls */}
                        <div className="mt-3 flex items-center justify-between lg:hidden">
                          <span className="text-xl font-bold text-blue-600">
                            $
                            {((item.book?.price || 0) * item.quantity).toFixed(
                              2
                            )}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.id, -1)
                                }
                                className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1 || actionLoading}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={actionLoading}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Quantity & Price */}
                      <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1 || actionLoading}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={actionLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[6rem]">
                          <p className="text-sm text-gray-500">
                            ${item.book?.price} each
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            $
                            {((item.book?.price || 0) * item.quantity).toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          disabled={actionLoading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-t border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Place Order</span>
                </button>

                {/* Security Info */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
