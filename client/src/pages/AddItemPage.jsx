
import React, { useState } from 'react';
import { useAddItemMutation } from '../features/items/itemApi';
import UploadDropzone from '../components/UploadDropzone';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';

const categories = ['Tools', 'Books', 'Appliances', 'Electronics', 'Others'];

const AddItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    zipCode: '',
    available: true,
    photos: [],
  });

  const [addItem, { isLoading }] = useAddItemMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === 'zipCode' && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotosChange = (photoUrls) => {
    setFormData((prev) => ({ ...prev, photos: photoUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (formData.photos.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      await addItem(formData).unwrap();
      toast.success('Item added successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        zipCode: '',
        available: true,
        photos: [],
      });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add item');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" mb={2}>Add New Item</Typography>
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
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          sx={{ mb: 2 }}
        />

        
        <UploadDropzone
          onChange={handlePhotosChange}
          value={formData.photos}
          disableHoverEffect
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>
    </Box>
  );
};

export default AddItemPage;
