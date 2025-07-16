
import React, { useState } from 'react';
import {
  AppBar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  MenuList,
  Divider,
  TextField,
  CircularProgress,
  Badge,
} from '@mui/material';
import {
  Handshake as HandshakeIcon,
  Person as PersonIcon,
  LockReset,
  Logout,
  Favorite,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { setZipCode, setCategory } from '../features/filters/filterSlice';

const categories = ['All', 'Tools', 'Books', 'Appliances', 'Electronics', 'Others'];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { zipCode, category } = useSelector((state) => state.filters);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loanMenuEl, setLoanMenuEl] = useState(null);
  const [itemMenuEl, setItemMenuEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLoanMenuOpen = (e) => setLoanMenuEl(e.currentTarget);
  const handleLoanMenuClose = () => setLoanMenuEl(null);
  const handleItemMenuOpen = (e) => setItemMenuEl(e.currentTarget);
  const handleItemMenuClose = () => setItemMenuEl(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((res) => setTimeout(res, 500));
    dispatch(logout());
    setIsLoggingOut(false);
    window.location.href = '/';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'zipCode') dispatch(setZipCode(value));
    else if (name === 'category') dispatch(setCategory(value));
  };

  const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?');

  return (
    <AppBar position="sticky" color="primary" sx={{ zIndex: 1200, width: '100%' }}>
      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 1 }}>
          <HandshakeIcon sx={{ fontSize: 30, color: 'white' }} />
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textDecoration: 'none',
              flexShrink: 1,
            }}
          >
            Borrow It
          </Typography>
        </Box>

        {/* Filters */}
        <TextField
          name="zipCode"
          value={zipCode}
          onChange={handleFilterChange}
          placeholder="Zip Code"
          size="small"
          variant="outlined"
          sx={{
            bgcolor: 'white',
            borderRadius: 1,
            minWidth: 80,
            maxWidth: 350,
            flexShrink: 1,
            flexGrow: 1,
          }}
        />
        <TextField
          name="category"
          select
          value={category}
          onChange={handleFilterChange}
          size="small"
          variant="outlined"
          sx={{
            bgcolor: 'white',
            borderRadius: 1,
            minWidth: 100,
            maxWidth: 500,
            flexShrink: 1,
            flexGrow: 1,
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Right-aligned section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, ml: 'auto' }}>
          {user ? (
            <>
              {/* Wishlist with badge */}
              <IconButton
                onClick={() => navigate('/wishlist')}
                color="inherit"
                sx={{ flexShrink: 1 }}
              >
                <Badge badgeContent={wishlistItems.length} color="error">
                  <Favorite sx={{ color: 'white' }} />
                </Badge>
              </IconButton>

              {/* Items */}
              <Button
                onClick={handleItemMenuOpen}
                variant="outlined"
                color="inherit"
                sx={{ textTransform: 'none', color: 'white', flexShrink: 1, minWidth: 60 }}
              >
                Items
              </Button>
              <Menu anchorEl={itemMenuEl} open={Boolean(itemMenuEl)} onClose={handleItemMenuClose}>
                <MenuItem onClick={() => { handleItemMenuClose(); navigate('/items/add'); }}>
                  Add Item
                </MenuItem>
                <MenuItem onClick={() => { handleItemMenuClose(); navigate('/my-items'); }}>
                  My Items
                </MenuItem>
              </Menu>

              {/* Loans */}
              <Button
                onClick={handleLoanMenuOpen}
                variant="outlined"
                color="inherit"
                sx={{ textTransform: 'none', color: 'white', flexShrink: 1, minWidth: 60 }}
              >
                Loans
              </Button>
              <Menu anchorEl={loanMenuEl} open={Boolean(loanMenuEl)} onClose={handleLoanMenuClose}>
                <MenuItem onClick={() => { handleLoanMenuClose(); navigate('/my-loans'); }}>
                  My Loans
                </MenuItem>
                <MenuItem onClick={() => { handleLoanMenuClose(); navigate('/loan-requests'); }}>
                  Loan Requests
                </MenuItem>
              </Menu>

              {/* Avatar Menu */}
              <IconButton color="inherit" onClick={handleMenuOpen} sx={{ flexShrink: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {getInitial(user.name)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuList>
                  <MenuItem disabled>
                    <Typography variant="subtitle2">{user.name}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/change-password'); }}>
                    <LockReset fontSize="small" sx={{ mr: 1 }} /> Reset Password
                  </MenuItem>
                  <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <>
                        <CircularProgress size={18} sx={{ mr: 1 }} color="inherit" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                      </>
                    )}
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button
              color="white"
              component={Link}
              to="/login"
              sx={{ flexShrink: 1, minWidth: 60, color: 'white' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Navbar;
