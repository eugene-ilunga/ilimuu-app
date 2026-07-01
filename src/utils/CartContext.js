"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);

  const fetchCart = async () => {
    const formData = new FormData();
    const res = await fetch("/api/cart/all", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setCartData(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartData, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
