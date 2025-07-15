import React from 'react';
import { useGetItemReviewsQuery } from '../features/review/reviewApi';
import { Box, Typography, Rating, CircularProgress, Divider } from '@mui/material';

const ReviewList = ({ itemId }) => {
  const { data: reviews, isLoading, isError } = useGetItemReviewsQuery(itemId);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load reviews.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Reviews</Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        reviews.map((review) => (
          <Box key={review._id} sx={{ my: 2 }}>
            <Typography variant="subtitle2">{review.reviewer.name}</Typography>
            <Rating value={review.rating} readOnly />
            {review.comment && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {review.comment}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewList;
