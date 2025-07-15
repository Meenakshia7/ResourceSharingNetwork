
// import React, { useState } from 'react';
// import {
//   useGetMyLoansQuery,
//   useCancelLoanMutation,
//   useReturnLoanMutation,
//   useRemoveLoanMutation,
// } from '../features/loan/loanApi';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   CircularProgress,
//   Grid,
//   Box,
// } from '@mui/material';
// import ConfirmDialog from '../components/ConfirmDialog';
// import toast from 'react-hot-toast';

// const MyLoansPage = () => {
//   const { data: loans, isLoading, refetch } = useGetMyLoansQuery();
//   const [cancelLoan] = useCancelLoanMutation();
//   const [returnLoan] = useReturnLoanMutation();
//   const [removeLoan] = useRemoveLoanMutation();

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [actionType, setActionType] = useState(null); 

//   const handleConfirmAction = async () => {
//     if (!selectedLoan) return;
//     try {
//       if (actionType === 'cancel') {
//         await cancelLoan(selectedLoan._id).unwrap();
//         toast.success('Loan request cancelled');
//       } else if (actionType === 'return') {
//         await returnLoan(selectedLoan._id).unwrap();
//         toast.success('Loan marked as returned');
//       } else if (actionType === 'remove') {
//         await removeLoan(selectedLoan._id).unwrap();
//         toast.success('Loan removed');
//       }
//       setSelectedLoan(null);
//       refetch(); 
//     } catch (err) {
//       toast.error(err?.data?.message || 'Action failed');
//     }
//     setConfirmOpen(false);
//   };

//   const handleActionClick = (loan, type) => {
//     setSelectedLoan(loan);
//     setActionType(type);
//     setConfirmOpen(true);
//   };

//   const renderStatus = (status) => {
//     const colors = {
//       pending: 'orange',
//       approved: 'green',
//       rejected: 'red',
//       returned: 'gray',
//     };
//     return (
//       <Typography
//         variant="body2"
//         sx={{ color: colors[status], fontWeight: 'bold' }}
//       >
//         {status.toUpperCase()}
//       </Typography>
//     );
//   };

//   if (isLoading) return <CircularProgress />;

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         My Borrowed Items
//       </Typography>
//       <Grid container spacing={2}>
//         {loans?.map((loan) => (
//           <Grid item xs={12} sm={6} md={4} key={loan._id}>
//             <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 300 }}>
//               <CardContent sx={{ flex: 1 }}>
//                 <Typography variant="h6" gutterBottom noWrap>
//                   {loan.item.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" noWrap>
//                   Owner: {loan.owner.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   From: {new Date(loan.loanStart).toLocaleDateString()}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   To: {new Date(loan.loanEnd).toLocaleDateString()}
//                 </Typography>
//                 <Box mt={1}>{renderStatus(loan.status)}</Box>
//               </CardContent>

//               <Box display="flex" flexDirection="column" gap={1} p={2} pt={0}>
//                 {loan.status === 'pending' && (
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleActionClick(loan, 'cancel')}
//                   >
//                     Cancel
//                   </Button>
//                 )}

//                 {loan.status === 'approved' && (
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => handleActionClick(loan, 'return')}
//                   >
//                     Return
//                   </Button>
//                 )}

//                 {(loan.status === 'rejected' || loan.status === 'returned') && (
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleActionClick(loan, 'remove')}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </Box>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <ConfirmDialog
//         open={confirmOpen}
//         onClose={() => setConfirmOpen(false)}
//         onConfirm={handleConfirmAction}
//         title={
//           actionType === 'cancel'
//             ? 'Cancel Loan Request'
//             : actionType === 'return'
//             ? 'Return Item'
//             : 'Remove Loan'
//         }
//         contentText={`Are you sure you want to ${actionType} this loan?`}
//         dialogProps={{ PaperProps: { style: { minWidth: 420 } } }}
//       />
//     </Box>
//   );
// };

// export default MyLoansPage;




import React, { useMemo, useState } from 'react';
import {
  useGetMyLoansQuery,
  useCancelLoanMutation,
  useReturnLoanMutation,
  useRemoveLoanMutation,
} from '../features/loan/loanApi';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ReviewForm from '../components/ReviewForm';
import { useGetItemReviewsQuery } from '../features/review/reviewApi';

const MyLoansPage = () => {
  const { data: loans, isLoading, refetch } = useGetMyLoansQuery();
  const [cancelLoan] = useCancelLoanMutation();
  const [returnLoan] = useReturnLoanMutation();
  const [removeLoan] = useRemoveLoanMutation();

  const user = useSelector((state) => state.auth.user);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showReviewFormForLoan, setShowReviewFormForLoan] = useState(null);

  // Collect unique item IDs for returned loans
  const returnedItemIds = useMemo(() => {
    return [...new Set(loans?.filter((l) => l.status === 'returned').map((l) => l.item._id))];
  }, [loans]);

  // Fetch reviews for first returned item (if any)
  const { data: reviews = [] } = useGetItemReviewsQuery(returnedItemIds[0], {
    skip: !returnedItemIds.length,
  });

  const handleConfirmAction = async () => {
    if (!selectedLoan) return;
    try {
      if (actionType === 'cancel') {
        await cancelLoan(selectedLoan._id).unwrap();
        toast.success('Loan request cancelled');
      } else if (actionType === 'return') {
        await returnLoan(selectedLoan._id).unwrap();
        toast.success('Loan marked as returned');
      } else if (actionType === 'remove') {
        await removeLoan(selectedLoan._id).unwrap();
        toast.success('Loan removed');
      }
      setSelectedLoan(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
    setConfirmOpen(false);
  };

  const handleActionClick = (loan, type) => {
    setSelectedLoan(loan);
    setActionType(type);
    setConfirmOpen(true);
  };

  const renderStatus = (status) => {
    const colors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      returned: 'gray',
    };
    return (
      <Typography variant="body2" sx={{ color: colors[status], fontWeight: 'bold' }}>
        {status.toUpperCase()}
      </Typography>
    );
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Borrowed Items
      </Typography>
      <Grid container spacing={2}>
        {loans?.map((loan) => {
          const alreadyReviewed = reviews?.some(
            (r) => r.loan === loan._id && r.reviewer === user?._id
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={loan._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 300,
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {loan.item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Owner: {loan.owner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    From: {new Date(loan.loanStart).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To: {new Date(loan.loanEnd).toLocaleDateString()}
                  </Typography>
                  <Box mt={1}>{renderStatus(loan.status)}</Box>
                </CardContent>

                <Box display="flex" flexDirection="column" gap={1} p={2} pt={0}>
                  {loan.status === 'pending' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleActionClick(loan, 'cancel')}
                    >
                      Cancel
                    </Button>
                  )}

                  {loan.status === 'approved' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleActionClick(loan, 'return')}
                    >
                      Return
                    </Button>
                  )}

                  {(loan.status === 'rejected' || loan.status === 'returned') && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleActionClick(loan, 'remove')}
                    >
                      Remove
                    </Button>
                  )}

                  {loan.status === 'returned' && !alreadyReviewed && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setShowReviewFormForLoan(loan)}
                    >
                      Write Review
                    </Button>
                  )}
                </Box>
              </Card>

              {showReviewFormForLoan?._id === loan._id && (
                <Box mt={1} px={2}>
                  <ReviewForm
                    itemId={loan.item._id}
                    loanId={loan._id}
                    ownerId={loan.owner._id}
                    onClose={() => setShowReviewFormForLoan(null)}
                    afterSubmit={() => {
                      setShowReviewFormForLoan(null);
                      refetch();
                    }}
                  />
                </Box>
              )}
            </Grid>
          );
        })}
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          actionType === 'cancel'
            ? 'Cancel Loan Request'
            : actionType === 'return'
            ? 'Return Item'
            : 'Remove Loan'
        }
        contentText={`Are you sure you want to ${actionType} this loan?`}
        dialogProps={{ PaperProps: { style: { minWidth: 420 } } }}
      />
    </Box>
  );
};

export default MyLoansPage;
