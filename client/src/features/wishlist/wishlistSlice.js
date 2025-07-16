
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: JSON.parse(localStorage.getItem('wishlist')) || [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const itemId = action.payload;
      const index = state.items.indexOf(itemId);

      if (index === -1) {
        state.items.push(itemId);
      } else {
        state.items.splice(index, 1);
      }

      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
