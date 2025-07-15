
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs" 
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 3,
          paddingX: 2,
          paddingY: 1.5,
        },
      }}
    >
      <DialogTitle variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
