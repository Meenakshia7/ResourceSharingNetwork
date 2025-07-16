
import React, {  useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Rating,
  IconButton,
  Grid,
  Button,
  Avatar,
  Dialog,
  TextField,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { useGetItemByIdQuery } from '../features/items/itemApi';
import { useRequestLoanMutation } from '../features/loan/loanApi';
import { useGetItemReviewsQuery } from '../features/review/reviewApi';
import ReviewList from '../components/ReviewList';
import toast from 'react-hot-toast';

import { toggleWishlist } from '../features/wishlist/wishlistSlice';


const ItemDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { data: item, isLoading, isError } = useGetItemByIdQuery(id);
  const itemId = item?._id;

  const {
    data: reviews = [],
    isLoading: isReviewLoading,
  } = useGetItemReviewsQuery(itemId, { skip: !itemId });

  const [currentImage, setCurrentImage] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [loanStart, setLoanStart] = useState('');
  const [loanEnd, setLoanEnd] = useState('');
  const [requestLoan, { isLoading: isRequesting }] = useRequestLoanMutation();
  
const favorited = wishlistItems.some((i) => i._id === item?._id);


  const today = new Date().toISOString().split('T')[0];

  
  const handleToggleWishlist = () => {
  if (!item) return;

  dispatch(toggleWishlist(item));
  const isWishlisted = wishlistItems.some((i) => i._id === item._id);
  toast.success(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
};


  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  if (isLoading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (isError || !item) return <Typography sx={{ p: 4 }}>Error loading item</Typography>;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % item.photos.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + item.photos.length) % item.photos.length);
  };

  const handleImageClick = () => setOpenPreview(true);

  const handleRequest = async () => {
    try {
      await requestLoan({ itemId: item._id, loanStart, loanEnd }).unwrap();
      toast.success('Loan request sent');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send request');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
        <Grid item xs={12} md={6} sx={{ flex: 1, maxWidth: '48%' }}>
          <Box
            onClick={handleImageClick}
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              height: 400,
              width: '100%',
            }}
          >
            <img
              src={item.photos?.[currentImage] || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={`Item ${currentImage + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {item.photos?.length > 1 && (
              <>
                <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', top: '50%', left: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.4)' }}>
                  <ArrowBackIos />
                </IconButton>
                <IconButton onClick={handleNextImage} sx={{ position: 'absolute', top: '50%', right: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.4)' }}>
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ flex: 1, maxWidth: '52%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
            <IconButton
              onClick={handleToggleWishlist}
              sx={{
                padding: 0,
                color: favorited ? 'error.main' : 'primary.main',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              {favorited ? <Favorite /> : <FavoriteBorder />}
            </IconButton>

            <IconButton color="primary" onClick={handleShare}>
              <Share />
            </IconButton>
          </Box>

          <Typography variant="h4" gutterBottom>{item.title}</Typography>

          {reviews.length > 0 ? (() => {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / reviews.length;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={averageRating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  {averageRating.toFixed(1)} stars ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                </Typography>
              </Box>
            );
          })() : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No ratings yet
            </Typography>
          )}

          <Typography variant="body1" paragraph>{item.description}</Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip label={item.available ? 'Available' : 'Unavailable'} color={item.available ? 'success' : 'warning'} />
            <Chip label={item.category} />
            <Chip label={item.zipCode} />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Owner:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Avatar>{item.owner?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography>{item.owner?.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">{item.owner?.email}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <TextField
              type="date"
              label="Start Date"
              value={loanStart}
              onChange={(e) => {
                setLoanStart(e.target.value);
                if (loanEnd && new Date(e.target.value) > new Date(loanEnd)) {
                  setLoanEnd('');
                }
              }}
              InputProps={{ inputProps: { min: today } }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="date"
              label="End Date"
              value={loanEnd}
              onChange={(e) => setLoanEnd(e.target.value)}
              InputProps={{ inputProps: { min: loanStart || today } }}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            disabled={!item.available || !loanStart || !loanEnd || isRequesting}
            onClick={handleRequest}
            sx={{ mt: 4 }}
          >
            Request to Borrow
          </Button>
        </Grid>
      </Grid>


      <Box sx={{ mt: 6 }}>
  <Typography variant="h5" gutterBottom>Reviews</Typography>
  <Box sx={{ height: 1, bgcolor: 'divider', mb: 2 }} />

  {isReviewLoading ? (
    <Typography>Loading reviews...</Typography>
  ) : reviews.length === 0 ? (
    <Typography color="text.secondary">No reviews yet for this item.</Typography>
  ) : (
    <>
      {/* Rating Summary */}
      <Box sx={{ mb: 4 }}>
        {(() => {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          const average = totalRating / reviews.length;

          const starCounts = [0, 0, 0, 0, 0];
          reviews.forEach(r => starCounts[r.rating - 1]++);

          return (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Rating value={average} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {average.toFixed(1)} / 5 ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                </Typography>
              </Box>

              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star - 1];
                const percentage = (count / reviews.length) * 100;
                return (
                  <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ width: 32 }}>{star}★</Typography>
                    <Box sx={{ flex: 1, maxWidth: 200, height: 8, bgcolor: 'grey.300', borderRadius: 1, mx: 1 }}>
                      <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
                    </Box>
                    <Typography sx={{ width: 30 }}>{count}</Typography>
                  </Box>
                );
              })}
            </>
          );
        })()}
      </Box>

      {/* Review List */}
      <ReviewList reviews={reviews} />
    </>
  )}
</Box>



      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="xl" fullWidth>
        <Box sx={{ position: 'relative', p: 2, bgcolor: 'black' }}>
          <IconButton onClick={() => setOpenPreview(false)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
            <Close />
          </IconButton>
          <img
            src={item.photos?.[currentImage]}
            alt={`Fullscreen ${currentImage + 1}`}
            style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', margin: 'auto' }}
          />
          {item.photos?.length > 1 && (
            <>
              <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', top: '50%', left: 20, color: 'white' }}>
                <ArrowBackIos />
              </IconButton>
              <IconButton onClick={handleNextImage} sx={{ position: 'absolute', top: '50%', right: 20, color: 'white' }}>
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ItemDetailPage;
