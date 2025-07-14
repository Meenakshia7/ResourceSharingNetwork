
import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Pagination,
  Rating,
} from '@mui/material';
import { useGetItemsQuery } from '../features/items/itemApi';
import { Link } from 'react-router-dom';

const categories = ['All', 'Tools', 'Books', 'Appliances', 'Electronics', 'Others'];

const ItemListPage = () => {
  const [filters, setFilters] = useState({ zipCode: '', category: 'All' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const queryParams = {
    ...(filters.zipCode && { zipCode: filters.zipCode }),
    ...(filters.category !== 'All' && { category: filters.category }),
  };

  const { data: items = [], isLoading, isError } = useGetItemsQuery(queryParams);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const truncateText = (text, maxLength = 40) => {
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
      <Typography variant="h4" mb={2} color="primary.main">
        Available Items
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Zip Code"
          name="zipCode"
          value={filters.zipCode}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Category"
          name="category"
          select
          value={filters.category}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

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
                height: '100%',
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

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {truncateText(item.description)}
                </Typography>

            

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip label={item.category} size="small" />
                  <Chip label={item.zipCode} size="small" />
                  {!item.available && <Chip label="Unavailable" color="warning" size="small" />}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Rating
                    value={item.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(item.createdAt)}
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
