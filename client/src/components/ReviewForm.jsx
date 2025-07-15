import React, { useState } from 'react';
import { useAddReviewMutation } from '../features/review/reviewApi';
import { Box, TextField, Button, Typography, Rating } from '@mui/material';
import toast from 'react-hot-toast';

const ReviewForm = ({ itemId, loanId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [addReview, { isLoading }] = useAddReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating.');

    try {
      await addReview({ item: itemId, loan: loanId, rating, comment }).unwrap();
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Leave a Review</Typography>

      <Rating
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        size="large"
      />

      <TextField
        label="Comment"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Box>
  );
};

export default ReviewForm;
