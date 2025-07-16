import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Divider,
  Avatar,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const ReviewList = ({ reviews = [] }) => {
  if (!Array.isArray(reviews)) {
    return <Typography color="error">Invalid reviews data.</Typography>;
  }

  if (reviews.length === 0) {
    return <Typography color="text.secondary">No reviews yet.</Typography>;
  }

  return (
    <Box>
      <Divider sx={{ mb: 2 }} />

      {reviews.map((review, index) => (
        <Box key={review._id || index} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mr: 2 }}>
              {review.reviewer?.name?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.reviewer?.name || 'Anonymous'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>

          <Rating
            value={review.rating}
            readOnly
            size="small"
            sx={{ mb: 1 }}
          />

          <Typography variant="body2" color="text.primary" sx={{ ml: 0.5 }}>
            {review.comment}
          </Typography>

          
          {index !== reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default ReviewList;
