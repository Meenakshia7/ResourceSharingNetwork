import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Rating,
} from '@mui/material';
import { useGetItemsQuery } from '../features/items/itemApi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const highlightCards = [
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

const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const ItemListPage = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const { zipCode, category } = useSelector((state) => state.filters);
  const { data: items = [], isLoading, isError } = useGetItemsQuery();

  const filteredItems = items.filter((item) => {
    const zipMatch = zipCode === '' || item.zipCode.includes(zipCode);
    const categoryMatch = category === 'All' || item.category === category;
    return zipMatch && categoryMatch;
  });

  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  const truncateText = (text, maxLength = 35) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/*  Highlight Slider with Images */}
      <Box sx={{ mb: 4 }}>
        <Slider {...sliderSettings}>
          {highlightCards.map((feature, i) => (
            <Box key={i} sx={{ px: 1 }}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 3,
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
            </Box>
          ))}
        </Slider>
      </Box>

      {isLoading && <Typography>Loading items...</Typography>}
      {isError && <Typography color="error">Failed to load items</Typography>}

      {/* Items Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
          justifyContent: 'center',
        }}
      >
        {paginatedItems.length === 0 && !isLoading ? (
          <Typography>No items found.</Typography>
        ) : (
          paginatedItems.map((item) => {
            const avgRating = item.reviews?.length
              ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length
              : item.rating || 0;

            return (
              <Card
                key={item._id}
                component={Link}
                to={`/items/${item._id}`}
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
              </Card>
            );
          })
        )}
      </Box>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default ItemListPage;
