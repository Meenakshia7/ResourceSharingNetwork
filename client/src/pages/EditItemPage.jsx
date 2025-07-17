import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useGetItemByIdQuery,
  useUpdateItemMutation,
} from '../features/items/itemApi';
import UploadDropzone from '../components/UploadDropzone';

const categories = ['Tools', 'Books', 'Appliances', 'Electronics', 'Others'];

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useGetItemByIdQuery(id);
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    zipCode: '',
    available: true,
    photos: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        zipCode: item.zipCode || '',
        available: item.available ?? true,
        photos: item.photos || [],
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotosChange = (photos) => {
    setFormData((prev) => ({ ...prev, photos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem({ id, ...formData }).unwrap();
      toast.success('Item updated!');
      navigate('/my-items');
    } catch (err) {
      toast.error('Failed to update item');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" mb={2}>
        Edit Item
      </Typography>

      {isLoading ? (
        <Typography>Loading item...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Category"
            name="category"
            select
            fullWidth
            required
            value={formData.category}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Zip Code"
            name="zipCode"
            fullWidth
            required
            value={formData.zipCode}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <UploadDropzone
            onChange={handlePhotosChange}
            value={formData.photos}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isUpdating}
            sx={{ mt: 3 }}
          >
            {isUpdating ? 'Updating...' : 'Update Item'}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default EditItemPage;
