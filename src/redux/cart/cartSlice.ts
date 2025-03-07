import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "./cartType";
import { Cart, CartItem } from "@/interfaces/Cart";

const calculateTotals = (items: CartItem[]) => {
  return {
    totalAmount: items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    ),
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  };
};

const loadCartFromStorage = (): CartState => {
  try {
    const storedCart = localStorage.getItem("cartItems");
    const parsedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
    return {
      items: parsedCart,
      ...calculateTotals(parsedCart),
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error loading cart from storage", error);
    return {
      items: [],
      totalAmount: 0,
      totalQuantity: 0,
      isLoading: false,
      error: null,
    };
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = action.payload.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
    },
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId._id === newItem.productId._id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      Object.assign(state, calculateTotals(state.items));
      if (state.items.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      } else {
        localStorage.removeItem("cartItems");
      }
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId._id !== action.payload);

      Object.assign(state, calculateTotals(state.items));

      if (state.items.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      } else {
        localStorage.removeItem("cartItems");
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
