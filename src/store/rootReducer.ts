import { combineReducers } from "redux";
import authReducer from "@/redux/auth/authSlice";

import searchReducer from "@/redux/search/searchSlice";

export const rootReducer = combineReducers({
  auth: authReducer,

  search: searchReducer,
});
