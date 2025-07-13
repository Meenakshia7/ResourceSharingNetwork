import {
  Container, TextField, Button, Typography, Box, Card, CardContent, IconButton, InputAdornment
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        password: form.password,
      });
      toast.success('Password reset! Login again');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={form.confirm}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
