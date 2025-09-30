// context/CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const API_BASE_URL = 'http://localhost:8000/api';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/cart/cart/`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        // Extract items array from response
        setCart(data.items || []);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart (or update quantity if exists)
  const addToCart = async (book) => {
    try {
      // Check if item already exists in cart
      const existingItem = cart.find((item) => item.book?.id === book.id);

      if (existingItem) {
        // Update quantity
        const response = await fetch(
          `${API_BASE_URL}/cart/cart/${existingItem.id}/update_item/`,
          {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity: existingItem.quantity + 1 })
          }
        );

        if (response.ok) {
          // Refresh cart to get updated data
          await fetchCart();
          return { success: true, message: 'Cart updated successfully' };
        }
      } else {
        // Add new item to cart
        const response = await fetch(
          `${API_BASE_URL}/cart/cart/add_item/`,
          {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
              book_id: book.id,
              quantity: 1 
            })
          }
        );

        if (response.ok) {
          // Refresh cart to get updated data
          await fetchCart();
          return { success: true, message: 'Item added to cart' };
        }
      }

      return { success: false, message: 'Failed to add item to cart' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Error adding to cart' };
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/cart/cart/${cartItemId}/update_item/`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ quantity: newQuantity })
        }
      );

      if (response.ok) {
        // Refresh cart to get updated data
        await fetchCart();
        return { success: true };
      }

      return { success: false, message: 'Failed to update quantity' };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Error updating quantity' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cart/cart/${cartItemId}/remove_item/`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        // Refresh cart to get updated data
        await fetchCart();
        return { success: true, message: 'Item removed from cart' };
      }

      return { success: false, message: 'Failed to remove item' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Error removing item' };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      // Call API to clear cart if you have such endpoint
      // Otherwise, delete items one by one
      const deletePromises = cart.map((item) =>
        fetch(`${API_BASE_URL}/cart/cart/${item.id}/remove_item/`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
      );

      await Promise.all(deletePromises);
      setCart([]);
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Error clearing cart' };
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.book?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        loading,
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        fetchCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}