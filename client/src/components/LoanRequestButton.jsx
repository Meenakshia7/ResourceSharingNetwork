
import React, { useState } from 'react';
import { useRequestLoanMutation } from '../features/api/loanApi';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import toast from 'react-hot-toast';

const LoanRequestButton = ({ itemId }) => {
  const [open, setOpen] = useState(false);
  const [loanStart, setLoanStart] = useState('');
  const [loanEnd, setLoanEnd] = useState('');

  const [requestLoan, { isLoading }] = useRequestLoanMutation();

  const handleRequest = async () => {
    try {
      await requestLoan({ itemId, loanStart, loanEnd }).unwrap();
      toast.success('Loan request sent');
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Loan request failed');
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>Request to Borrow</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Request to Borrow</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Start Date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={loanStart}
            onChange={(e) => setLoanStart(e.target.value)}
          />
          <TextField
            type="date"
            label="End Date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={loanEnd}
            onChange={(e) => setLoanEnd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRequest} disabled={isLoading}>Send Request</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoanRequestButton;
