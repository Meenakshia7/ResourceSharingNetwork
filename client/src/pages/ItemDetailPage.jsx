
import { useParams } from 'react-router-dom';
import { useGetItemByIdQuery } from '../features/items/itemApi';
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
} from '@mui/material';
import {
  FavoriteBorder,
  Share,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
} from '@mui/icons-material';
import React, { useState } from 'react';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { data: item, isLoading, isError } = useGetItemByIdQuery(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);

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

  const handleImageClick = () => {
    setOpenPreview(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>

        {/* LEFT IMAGE SECTION */}
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
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />

            {item.photos?.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 10,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.4)',
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 10,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.4)',
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>

        {/* RIGHT DETAILS SECTION */}
        <Grid item xs={12} md={6} sx={{ flex: 1, maxWidth: '52%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
            <IconButton color="primary">
              <FavoriteBorder />
            </IconButton>
            <IconButton color="primary">
              <Share />
            </IconButton>
          </Box>

          <Typography variant="h4" gutterBottom>
            {item.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={item.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              {item.rating ? `${item.rating} stars` : 'No ratings yet'}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {item.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={item.available ? 'Available' : 'Unavailable'}
              color={item.available ? 'success' : 'warning'}
            />
            <Chip label={item.category} />
            <Chip label={item.zipCode} />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Owner:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Avatar>{item.owner?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography>{item.owner?.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.owner?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            disabled={!item.available}
            sx={{ mt: 4 }}
          >
            Request to Borrow
          </Button>
        </Grid>
      </Grid>

      {/* FULLSCREEN IMAGE VIEW */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="xl" fullWidth>
        <Box sx={{ position: 'relative', p: 2, bgcolor: 'black' }}>
          <IconButton
            onClick={() => setOpenPreview(false)}
            sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
          >
            <Close />
          </IconButton>

          <img
            src={item.photos?.[currentImage]}
            alt={`Fullscreen ${currentImage + 1}`}
            style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', margin: 'auto' }}
          />

          {item.photos?.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{ position: 'absolute', top: '50%', left: 20, color: 'white' }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{ position: 'absolute', top: '50%', right: 20, color: 'white' }}
              >
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
