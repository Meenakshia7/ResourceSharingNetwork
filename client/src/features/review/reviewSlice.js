import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReviewModalOpen: false,
  ratingFilter: 0,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    openReviewModal: (state) => {
      state.isReviewModalOpen = true;
    },
    closeReviewModal: (state) => {
      state.isReviewModalOpen = false;
    },
    setRatingFilter: (state, action) => {
      state.ratingFilter = action.payload;
    },
    clearRatingFilter: (state) => {
      state.ratingFilter = 0;
    },
  },
});

export const {
  openReviewModal,
  closeReviewModal,
  setRatingFilter,
  clearRatingFilter,
} = reviewSlice.actions;

export default reviewSlice.reducer;
