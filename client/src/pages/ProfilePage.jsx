import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/*back arrow */}
      <IconButton
  onClick={() => navigate('/')}
  sx={{
    position: 'absolute',
    top: 16,
    left: 16,
    color: 'text.primary',
    bgcolor: 'transparent',
    '&:hover': {
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  }}
>
  <ArrowBack sx={{ fontSize: 28 }} />
</IconButton>

      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 4, borderRadius: 3, mt: 5 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
          }}
        >
          <Avatar
            src={user?.avatar || ''}
            alt={user?.name}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography variant="h5" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email}
          </Typography>
          <Divider sx={{ width: '100%', my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Zip Code: {user?.zipCode || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Member since: {formatDate(user?.createdAt)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
