import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useDeleteItemMutation, useGetItemsQuery } from '../features/items/itemApi';
import { useSelector, useDispatch } from 'react-redux';
import { itemApi } from '../features/items/itemApi';
import ConfirmDialog from '../components/ConfirmDialog'; 

const ITEMS_PER_PAGE = 4;

const MyItemsPage = () => {
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const [deleteItem] = useDeleteItemMutation();
  const { data: allItems = [], isLoading, isError } = useGetItemsQuery();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const myItems = allItems.filter((item) => item.owner?._id === userId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedItemId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(selectedItemId).unwrap();
      toast.success('Item deleted successfully');
      dispatch(itemApi.util.invalidateTags(['Item']));
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete item');
    } finally {
      setConfirmOpen(false);
      setSelectedItemId(null);
    }
  };

  const totalPages = Math.ceil(myItems.length / ITEMS_PER_PAGE);
  const paginatedItems = myItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Items
        </Typography>
      </Box>

      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Error fetching items</Typography>}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3,
          '@media (max-width: 1200px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
          '@media (max-width: 900px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        {paginatedItems.map((item) => (
          <Card
            key={item._id}
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <CardMedia
              component="img"
              height="180"
              image={item.photos?.[0] || 'https://via.placeholder.com/300x180'}
              alt={item.title}
              sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom noWrap>
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.description}
              </Typography>
            </CardContent>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                pt: 0,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/items/edit/${item._id}`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => handleDeleteClick(item._id)}
              >
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </Box>
  );
};

export default MyItemsPage;
