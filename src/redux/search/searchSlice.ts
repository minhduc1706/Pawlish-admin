import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "./searchType";

const initialState: SearchState = {
  open: false,
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearch: (state) => {
      state.open = true;
    },
    closeSearch: (state) => {
      state.open = false;
    },
    toggleSearch: (state) => {
      state.open = !state.open;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetSearch: (state) => {
      state.open = false;
      state.query = "";
    },
  },
});

export const { closeSearch, openSearch, toggleSearch, setQuery, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
