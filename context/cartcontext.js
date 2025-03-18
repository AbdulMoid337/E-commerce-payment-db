"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product) => {
    if (!product) return;
    
    const productId = product._id || product.id;
    
    // Ensure we have all required product data
    const productToAdd = {
      _id: productId,
      id: productId,
      name: product.name || "Unknown Product",
      price: product.price || 0,
      description: product.description || "",
      category: product.category || "",
      imageUrl: product.imageUrl || product.images?.[0] || "",
      images: product.images || (product.imageUrl ? [product.imageUrl] : []),
      quantity: product.quantity || 1
    };
    
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => 
        (item._id === productId) || (item.id === productId)
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedCart = [...prevCart];
        const newQuantity = (updatedCart[existingItemIndex].quantity || 1) + (product.quantity || 1);
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity
        };
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, productToAdd];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        (item._id !== productId) && (item.id !== productId)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => {
        const itemId = item._id || item.id;
        if (itemId === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => 
      (item._id === productId) || (item.id === productId)
    );
  };

  // Get quantity of product in cart
  const getQuantityInCart = (productId) => {
    const item = cart.find(item => 
      (item._id === productId) || (item.id === productId)
    );
    return item ? item.quantity : 0;
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      isInCart,
      getQuantityInCart,
      calculateTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}