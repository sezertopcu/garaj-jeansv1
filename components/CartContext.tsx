"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  addToCart: (
    product: Product,
    size: string,
    quantity: number
  ) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("garaj-jeans-cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        setItems(parsedCart);
      } catch {
        localStorage.removeItem("garaj-jeans-cart");
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "garaj-jeans-cart",
      JSON.stringify(items)
    );
  }, [items, loaded]);

  function addToCart(
    product: Product,
    size: string,
    quantity: number
  ) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id && item.size === size
            ? {
                ...item,
                quantity: Math.min(
                  product.stock,
                  item.quantity + quantity
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          size,
          quantity,
        },
      ];
    });
  }

  function removeFromCart(productId: string, size: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size
          )
      )
    );
  }

  function updateQuantity(
    productId: string,
    size: string,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId && item.size === size
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.product.stock, quantity)
              ),
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart, CartProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
}