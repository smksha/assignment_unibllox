import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import * as cartApi from "../api/cart";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  //getItemQuantity: (id: number) => number;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    cartApi.fetchCart().then((apiItems) => {
      const uiItems: CartItem[] = apiItems.map((item) => ({
        ...item,
        thumbnail: item.thumbnail,
      }));

      setCartItems((prev) =>
        uiItems.map((item) => {
          const existing = prev.find((p) => p.id === item.id);

          return {
            ...item,
            thumbnail: existing?.thumbnail || item.thumbnail,
          };
        }),
      );
    });
  }, []);

  const addToCart = async (item: cartApi.ApiCartItem) => {
    const updated = await cartApi.addToCart(item);

    setCartItems((prev) =>
      updated.map((i) => {
        const existing = prev.find((p) => p.id === i.id);

        return {
          ...i,
          thumbnail: existing?.thumbnail || i.thumbnail,
        };
      }),
    );
  };

  const removeFromCart = async (id: number) => {
    const updated = await cartApi.removeFromCart(id);
    setCartItems((prev) =>
      updated.map((item) => {
        const existing = prev.find((p) => p.id === item.id);

        return {
          ...item,
          thumbnail: existing?.thumbnail || item.thumbnail,
        };
      }),
    );
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
  /*
  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity ?? 0;
  };

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return [...prev, item];

      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
      );
    });
  }, []);

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
*/
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
