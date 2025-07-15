
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
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
} from '@mui/material';
import {
  Handshake as HandshakeIcon,
  Person as PersonIcon,
  LockReset,
  Logout,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { setZipCode, setCategory } from '../features/filters/filterSlice';

const categories = ['All', 'Tools', 'Books', 'Appliances', 'Electronics', 'Others'];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { zipCode, category } = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loanMenuEl, setLoanMenuEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLoanMenuOpen = (e) => setLoanMenuEl(e.currentTarget);
  const handleLoanMenuClose = () => setLoanMenuEl(null);

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
    <AppBar position="static" color="primary" sx={{ px: 2 }}>
      <Toolbar
        disableGutters
        sx={{
          width: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 2,

          
          scrollbarWidth: 'none', 
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
        }}
      >


        {/* LOGO + FILTERS */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2, flexShrink: 0 }}>
            <HandshakeIcon sx={{ fontSize: 34, color: 'white' }} />
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'Segoe UI, sans-serif',
                flexShrink: 0,
              }}
            >
              
            </Typography>
          </Box>

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
              minWidth: 120,
              width: 300,
              flexShrink: 0,
            }}
            InputProps={{ sx: { fontSize: 14 } }}
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
              minWidth: 160,
              width: 500,
              flexShrink: 0,
            }}
            InputProps={{ sx: { fontSize: 14 } }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto', flexShrink: 0 }}>
          {user && (
            <>
              <Button
                component={Link}
                to="/items/add"
                variant="outlined"
                color="inherit"
                sx={{ textTransform: 'none', color: 'white', flexShrink: 0 }}
              >
                Add Item
              </Button>

              <Button
                onClick={handleLoanMenuOpen}
                variant="outlined"
                color="inherit"
                sx={{ textTransform: 'none', color: 'white', flexShrink: 0 }}
              >
                Loans
              </Button>

              {/* Loan Menu */}
              <Menu
                anchorEl={loanMenuEl}
                open={Boolean(loanMenuEl)}
                onClose={handleLoanMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { handleLoanMenuClose(); navigate('/my-loans'); }}>
                  My Loans
                </MenuItem>
                <MenuItem onClick={() => { handleLoanMenuClose(); navigate('/loan-requests'); }}>
                  Loan Requests
                </MenuItem>
              </Menu>
            </>
          )}

          {!user ? (
            <Button color="inherit" component={Link} to="/login" sx={{ flexShrink: 0 }}>
              Login
            </Button>
          ) : (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen} sx={{ flexShrink: 0 }}>
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
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/reset-password'); }}>
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
          )}
        </Box>
      </Toolbar>

    </AppBar>
  );
};

export default Navbar;
