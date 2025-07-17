import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/X'; 

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        color: '#111',
        px: { xs: 2, sm: 6 },
        pt: 6,
        pb: 3,
        borderTop: '1px solid #e0e0e0',
        fontFamily: 'inherit',
      }}
    >
    
      <Grid container spacing={4}>
        

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 , underline: 'none'}}>
            Support
          </Typography>
          <Link href="/faq" underline= "none" color="inherit" display="block" mb={1}>
            FAQ
          </Link>
          <Link href="/contact" underline= "none" color="inherit" display="block">
            Contact Us
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Company
          </Typography>
          <Link href="/about" underline="none" color="inherit" display="block" mb={1}>
            About Us
          </Link>
          <Link href="/careers" underline="none" color="inherit" display="block">
            Careers
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Stay in the loop
          </Typography>
          <TextField
            placeholder="Enter your email"
            size="small"
            fullWidth
            sx={{
              bgcolor: '#f9f9f9',
              borderRadius: 1,
              mb: 1,
              input: { px: 1 },
            }}
          />
          <Button variant="contained" color="primary" size="small" fullWidth>
            Subscribe
          </Button>
        </Grid>
      </Grid>

      
      <Box sx={{ mt: 4 }} />

      
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{ color: '#555', textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {new Date().getFullYear()} Borrow It. All rights reserved.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{ textAlign: { xs: 'center', sm: 'right' }, mt: { xs: 2, sm: 0 } }}
        >
          <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#111' }}>
            <InstagramIcon />
          </IconButton>
          <IconButton href="https://x.com" target="_blank" sx={{ color: '#111' }}>
            <TwitterIcon />
          </IconButton>
          <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#111' }}>
            <FacebookIcon />
          </IconButton>
          <IconButton href="https://youtube.com" target="_blank" sx={{ color: '#111' }}>
            <YouTubeIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
