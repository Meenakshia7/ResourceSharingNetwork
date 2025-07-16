
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
  Box,
  Dialog,
  IconButton,
} from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ReviewForm from '../components/ReviewForm';
import { useGetItemReviewsQuery } from '../features/review/reviewApi';
import { ArrowBack } from '@mui/icons-material';

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const returnedItemIds = useMemo(() => {
    return [...new Set(loans?.filter((l) => l.status === 'returned').map((l) => l.item._id))];
  }, [loans]);

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

  const paginatedLoans = loans?.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil((loans?.length || 0) / itemsPerPage);

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton href="/items" sx={{color : 'black'}} >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">My Borrowed Items</Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        {paginatedLoans?.map((loan) => {
          const alreadyReviewed = reviews?.some(
            (r) => r.loan === loan._id && r.reviewer === user?._id
          );

          return (
            <Box key={loan._id} width="100%" maxWidth={500}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {loan.item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Owner: {loan.owner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    From: {new Date(loan.loanStart).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To: {new Date(loan.loanEnd).toLocaleDateString()}
                  </Typography>
                  <Box mt={1}>{renderStatus(loan.status)}</Box>

                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
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
                        Write a Review
                      </Button>
                    )}
                  </Box>
                </CardContent>

                <Dialog
                  open={showReviewFormForLoan?._id === loan._id}
                  onClose={() => setShowReviewFormForLoan(null)}
                  maxWidth="sm"
                  fullWidth
                >
                  <Box p={3}>
                    <ReviewForm
                      itemId={loan.item._id}
                      loanId={loan._id}
                      ownerId={loan.item.owner}
                      onClose={() => setShowReviewFormForLoan(null)}
                      afterSubmit={() => {
                        setShowReviewFormForLoan(null);
                        refetch();
                      }}
                    />
                  </Box>
                </Dialog>
              </Card>
            </Box>
          );
        })}

        {totalPages > 1 && (
          <Box display="flex" gap={2} mt={4}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2">Page {page} of {totalPages}</Typography>
            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>

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
