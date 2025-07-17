import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const itemApi = createApi({
  reducerPath: 'itemApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.user?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (filters) => {
        const params = new URLSearchParams(filters).toString();
        return `/items?${params}`;
      },
      providesTags: ['Item'],
    }),
    getItemById: builder.query({
      query: (id) => `/items/${id}`,
    }),
    addItem: builder.mutation({
      query: (data) => ({
        url: '/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Item'],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
