import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetItemByIdQuery } from '../features/items/itemApi';

const WishlistCard = ({ itemId }) => {
  const { data: item, isLoading, isError } = useGetItemByIdQuery(itemId);

  if (isLoading || isError || !item) return null;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="180"
          image={item.photos?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'}
          alt={item.title}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom noWrap>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {item.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {item.category} • {item.zipCode}
            </Typography>
          </Box>
          <Button
            component={Link}
            to={`/item/${item._id}`}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

const WishlistPage = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Typography color="text.secondary">Your wishlist is empty.</Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((itemId) => (
            <WishlistCard key={itemId} itemId={itemId} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WishlistPage;
