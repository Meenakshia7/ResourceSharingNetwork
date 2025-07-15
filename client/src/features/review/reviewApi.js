import { apiSlice } from '../apiSlice';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review'],
    }),

    getItemReviews: builder.query({
      query: (itemId) => `/reviews/item/${itemId}`,
      providesTags: ['Review'],
    }),

    getOwnerReviews: builder.query({
      query: (ownerId) => `/reviews/owner/${ownerId}`,
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetItemReviewsQuery,
  useGetOwnerReviewsQuery,
} = reviewApi;
