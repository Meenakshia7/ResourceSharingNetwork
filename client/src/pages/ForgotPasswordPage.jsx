import {
  Container, TextField, Button, Typography, Box, Card, CardContent
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending link');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Enter your registered email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
