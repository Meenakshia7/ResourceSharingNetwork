import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useChangePasswordMutation } from '../features/auth/authApi'; 

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully');

      // Logout and redirect to login
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', position: 'relative' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', top: 12, left: 12 }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          Change Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            name="currentPassword"
            label="Current Password"
            type={show.current ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleVisibility('current')} edge="end">
                    {show.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="newPassword"
            label="New Password"
            type={show.new ? 'text' : 'password'}
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleVisibility('new')} edge="end">
                    {show.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type={show.confirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleVisibility('confirm')} edge="end">
                    {show.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 , color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordPage;
