import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zipCode: '',
  category: 'All',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setZipCode: (state, action) => {
      state.zipCode = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    resetFilters: (state) => {
      state.zipCode = '';
      state.category = 'All';
    },
  },
});

export const { setZipCode, setCategory, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
