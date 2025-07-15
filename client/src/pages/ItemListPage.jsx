

import React, { useState } from 'react';
import {
  Box,
  Grid,
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


const bannerImages = [
  {
    url: `${process.env.PUBLIC_URL}/tools.jpg`,
    alt: 'Tools Banner',
  },
  {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    alt: 'Books Banner',
  },
  {
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Electronics Banner',
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const ItemListPage = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const { zipCode, category } = useSelector((state) => state.filters);
  const { data: items = [], isLoading, isError } = useGetItemsQuery();

  // 🔍 Filter logic
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
      {/* 🖼️ Banner Slider */}
      <Box sx={{ mb: 4 }}>
        <Slider {...sliderSettings}>
          {bannerImages.map((img, i) => (
            <Box key={i}>
              <img
                src={img.url}
                alt={img.alt}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* 📦 Item Listing */}
      {isLoading && <Typography>Loading items...</Typography>}
      {isError && <Typography color="error">Failed to load items</Typography>}

      <Grid container spacing={3} justifyContent="flex-start">
        {paginatedItems.length === 0 && !isLoading && (
          <Grid item xs={12}>
            <Typography>No items found.</Typography>
          </Grid>
        )}

        {paginatedItems.map((item) => (
          <Grid item key={item._id}>
            <Card
              component={Link}
              to={`/items/${item._id}`}
              sx={{
                width: 300,
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

              {/* Date */}
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
                  <Rating value={item.rating || 0} precision={0.5} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {item.zipCode}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
