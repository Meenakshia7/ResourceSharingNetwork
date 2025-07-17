import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const UploadDropzone = ({ onChange, value = [] }) => {
  const inputRef = useRef();

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.path; 
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const handleFiles = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) uploadedUrls.push(url);
    }
    onChange([...value, ...uploadedUrls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const removeImage = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      sx={{
        border: '2px dashed #ccc',
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        cursor: 'pointer',
        mb: 2,
      }}
    >
      <CloudUploadIcon fontSize="large" />
      <Typography variant="body1" sx={{ mt: 1 }}>
        Click or Drag & Drop images here
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {value.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <img
              src={`http://localhost:5000${url}`} 
              alt={`preview-${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'white',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadDropzone;
