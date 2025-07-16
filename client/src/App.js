
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import MyLoansPage from './pages/MyLoansPage';
import RequestsToMePage from './pages/RequestsToMePage';
import MyItemsPage from './pages/MyItemsPage';
import EditItemPage from './pages/EditItemPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Footer from './components/Footer'; // Importing the Footer component
import WishlistPage from './pages/WishlistPage';


// Items module
import ItemListPage from './pages/ItemListPage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';

import { Box } from '@mui/material'; // for layout

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideNavbar && <Navbar />}

      <Box component="main" flex="1">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 1500,
            className: 'c-toast',
            style: {
              background: '#fff',
              color: '#111',
              border: '1px solid #ddd',
              padding: '14px 20px',
              borderRadius: '10px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
              fontSize: '0.95rem',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#58C044',
                secondary: '#e6f4ea',
              },
            },
            error: {
              iconTheme: {
                primary: '#d93025',
                secondary: '#fdecea',
              },
            },
          }}
          containerStyle={{
            top: '70px',
            right: '20px',
          }}
        />

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Public Landing Page */}
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="/items" element={<ItemListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Protected Routes */}
          <Route
            path="/items/add"
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id"
            element={
              <ProtectedRoute>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/edit/:id"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />
          <Route path="/my-loans" element={<ProtectedRoute><MyLoansPage /></ProtectedRoute>} />
          <Route path="/loan-requests" element={<ProtectedRoute><RequestsToMePage /></ProtectedRoute>} />
        </Routes>
      </Box>

      {!hideNavbar && <Footer />}
    </Box>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
