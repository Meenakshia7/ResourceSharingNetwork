import { apiSlice } from './loanSlice';

export const loanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestLoan: builder.mutation({
      query: (data) => ({
        url: '/loans/request',
        method: 'POST',
        body: data,
      }),
    }),
    getMyLoans: builder.query({
      query: () => '/loans/mine',
    }),
    getRequestsToMe: builder.query({
      query: () => '/loans/owned',
    }),
    approveLoan: builder.mutation({
      query: (loanId) => ({
        url: `/loans/${loanId}/approve`,
        method: 'PATCH',
      }),
    }),
    rejectLoan: builder.mutation({
      query: (loanId) => ({
        url: `/loans/${loanId}/reject`,
        method: 'PATCH',
      }),
    }),
    returnLoan: builder.mutation({
      query: (loanId) => ({
        url: `/loans/${loanId}/return`,
        method: 'PATCH',
      }),
    }),
    cancelLoan: builder.mutation({        
      query: (loanId) => ({
        url: `/loans/${loanId}/cancel`,
        method: 'DELETE',
      }),
       invalidatesTags: ['Loan'],
    }),
    removeLoan: builder.mutation({
  query: (loanId) => ({
    url: `/loans/${loanId}/remove`,
    method: 'DELETE',
  }),
  invalidatesTags: ['Loan'],
}),

  }),
});

export const {
  useRequestLoanMutation,
  useGetMyLoansQuery,
  useGetRequestsToMeQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
  useReturnLoanMutation,
  useCancelLoanMutation, 
  useRemoveLoanMutation,

} = loanApi;
