
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
import { itemApi } from '../features/items/itemApi';
import filterReducer from '../features/filters/filterSlice'; 
import { loanApi } from '../features/loan/loanApi';
import { reviewApi } from '../features/review/reviewApi';
import reviewReducer from '../features/review/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filterReducer, 
    review: reviewReducer,
    [authApi.reducerPath]: authApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [loanApi.reducerPath]: loanApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(itemApi.middleware)
      .concat(loanApi.middleware)
      .concat(reviewApi.middleware), 
});
