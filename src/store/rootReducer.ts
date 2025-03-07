import { combineReducers } from "redux";
import authReducer from "@/redux/auth/authSlice";
import cartReducer from "@/redux/cart/cartSlice";
import searchReducer from "@/redux/search/searchSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  search: searchReducer,
});