import { CartItem } from "@/interfaces/Cart";

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  isLoading: boolean,
  error: string | null;
}