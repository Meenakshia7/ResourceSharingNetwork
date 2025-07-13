
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#58C044', 
    },
    secondary: {
      main: '#FFD700', 
    },
    background: {
      default: '#f8fff5', 
    },
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12, 
  },
});

export default theme;
