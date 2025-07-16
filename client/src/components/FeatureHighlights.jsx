import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const highlights = [
  {
    title: 'Post Your Item',
    description: 'Share your items with the community and help others.',
    image: '/assets/upload.svg',
    color: '#e3f2fd',
  },
  {
    title: 'Rate & Review',
    description: 'Leave feedback and build trust through honest reviews.',
    image: '/assets/review.svg',
    color: '#fff3e0',
  },
  {
    title: 'Browse Nearby Items',
    description: 'Find tools, books, and gadgets in your neighborhood.',
    image: '/assets/map.svg',
    color: '#e8f5e9',
  },
];

const FeatureHighlights = () => {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', mb: 4 }}>
      {highlights.map((feature, i) => (
        <Card
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 3,
            bgcolor: feature.color,
            borderRadius: 3,
            minHeight: 240,
            boxShadow: 2,
          }}
        >
          <Box
            component="img"
            src={feature.image}
            alt={feature.title}
            sx={{ width: 80, height: 80, objectFit: 'contain' }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default FeatureHighlights;
