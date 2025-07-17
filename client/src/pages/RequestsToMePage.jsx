import React, { useState } from 'react';
import {
  useGetRequestsToMeQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
} from '../features/loan/loanApi';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const RequestsToMePage = () => {
  const { data: loans = [], isLoading, refetch } = useGetRequestsToMeQuery();
  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionType, setActionType] = useState(null); 
  const handleActionConfirm = async () => {
    if (!selectedLoan) return;

    try {
      if (actionType === 'approve') {
        await approveLoan(selectedLoan._id).unwrap();
        toast.success('Loan approved');
      } else if (actionType === 'reject') {
        await rejectLoan(selectedLoan._id).unwrap();
        toast.success('Loan rejected');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }

    setConfirmOpen(false);
    setSelectedLoan(null);
    setActionType(null);
  };

  const openConfirm = (loan, type) => {
    setSelectedLoan(loan);
    setActionType(type);
    setConfirmOpen(true);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Requests to My Items
      </Typography>
      <Grid container spacing={2}>
        {loans.map((loan) => (
          <Grid item xs={12} sm={6} md={4} key={loan._id}>
            <Card sx={{ minWidth: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {loan.item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Requested by: {loan.borrower.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From: {new Date(loan.loanStart).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To: {new Date(loan.loanEnd).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      loan.status === 'pending'
                        ? 'orange'
                        : loan.status === 'approved'
                        ? 'green'
                        : 'red',
                    fontWeight: 'bold',
                    mt: 1,
                  }}
                >
                  {loan.status.toUpperCase()}
                </Typography>
              </CardContent>
              {loan.status === 'pending' && (
                <Box display="flex" justifyContent="space-between" p={2} pt={0}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => openConfirm(loan, 'approve')}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => openConfirm(loan, 'reject')}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleActionConfirm}
        title={actionType === 'approve' ? 'Approve Loan' : 'Reject Loan'}
        message={`Are you sure you want to ${actionType} this request?`}
      />
    </Box>
  );
};

export default RequestsToMePage;
