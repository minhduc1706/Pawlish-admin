import apiClient from "@/config/axiosClient";
import { Cart, CartItem } from "@/interfaces/Cart";
import { setCart } from "@/redux/cart/cartSlice";
import { AppDispatch } from "@/store";

export const getCart = async (): Promise<Cart | null> => {
  try {
    const { data } = await apiClient.get("/cart");
    return data;
  } catch (error) {
    console.error("Error fetching cart from server", error);
    throw error;
  }
};

export const addItemToCart = async (item: CartItem): Promise<Cart> => {
  try {
    const { data } = await apiClient.post("/cart", item);
    return data;
  } catch (error) {
    console.error("Error adding item to cart", error);
    throw error;
  }
};

export const removeItemFromCart = async (itemId: string): Promise<void> => {
  try {
    await apiClient.delete(`/cart/remove/${itemId}`);
  } catch (error) {
    console.error("Error removing item from cart", error);
    throw error;
  }
};

export const syncCartAfterLogin = async (
  dispatch: AppDispatch
): Promise<CartItem[]> => {
  try {
    const storedCart = localStorage.getItem("cartItems");
    const localCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const serverCart = await getCart();

    if (!serverCart) {
      dispatch(
        setCart({
          user_id: "",
          items: [],
          totalPrice: 0,
        })
      );
      return [];
    }

    const updatedItems = localCart.map((localItem) => {
      const serverItem = serverCart.items.find(
        (item) => item.productId === localItem.productId
      );
      if (serverItem) {
        return {
          ...localItem,
          quantity: Math.max(localItem.quantity, serverItem.quantity),
        };
      }
      return localItem;
    });

    const uniqueItems = localCart.filter(
      (localItem) =>
        !serverCart.items.some((item) => item.productId === localItem.productId)
    );

    const finalItemsToSync = [...updatedItems, ...uniqueItems];

    if (finalItemsToSync.length > 0) {
      await apiClient.post("/cart/bulk-add", finalItemsToSync);
    }

    localStorage.removeItem("cartItems");

    const newCart = await getCart();
    if (newCart) {
      dispatch(setCart(newCart));
    }

    return finalItemsToSync;
  } catch (error) {
    console.error("Error syncing cart after login", error);
    throw error;
  }
};
