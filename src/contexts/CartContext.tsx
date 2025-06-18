// context/CartContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { get_products_cart } from "@/apis_reqests/products";

interface CartContextType {
  cartCount: number;
  refreshCart: () => void;
  removeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: () => {},
  removeCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const refreshCart = async () => {
    const cart = await get_products_cart();
    if (cart) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      console.log(totalItems);
      setCartCount(totalItems);
    }
  };
  function removeCart(){
    setCartCount((prev) => prev-1);
    setTimeout(() => refreshCart(), 2000);
  }
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, removeCart }}>
      {children}
    </CartContext.Provider>
  );
};