
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
  const itemId = action.payload;
  if (state.items.includes(itemId)) {
    state.items = state.items.filter((id) => id !== itemId);
  } else {
    state.items.push(itemId);
  }
},
    addToWishlist: (state, action) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
