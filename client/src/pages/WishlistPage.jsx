import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Card, CardContent, CardMedia, Rating, Button } from '@mui/material';
import { useGetItemByIdQuery } from '../features/items/itemApi';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const truncateText = (text, maxLength = 35) => {
  if (!text) return '';
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
};

const WishlistCard = ({ itemId }) => {
  const dispatch = useDispatch();
  const { data: item, isLoading, isError } = useGetItemByIdQuery(itemId);

  if (isLoading || isError || !item) return null;

  const avgRating = item.reviews?.length
    ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length
    : item.rating || 0;

  return (
    <Card
      key={item._id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        image={item.photos?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'}
        alt={item.title}
        sx={{
          height: 180,
          objectFit: 'contain',
          p: 1,
          borderBottom: '1px solid #eee',
        }}
      />

      <Box sx={{ px: 2, pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          {formatDate(item.createdAt)}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, pt: 0 }}>
        <Typography
          variant="h6"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'text.primary',
          }}
        >
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {truncateText(item.description)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Rating value={avgRating} precision={0.5} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {item.zipCode}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          size="small"
          fullWidth
          onClick={() => dispatch(removeFromWishlist(item._id))}
        >
          Remove
        </Button>
      </Box>
    </Card>
  );
};

const WishlistPage = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={() => navigate('/')}
      >
        <span style={{ marginRight: 8 }}>←</span> My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Typography color="text.secondary">Your wishlist is empty.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {wishlistItems.map((id) => (
            <WishlistCard key={id} itemId={id} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WishlistPage;
