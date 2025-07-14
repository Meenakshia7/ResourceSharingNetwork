
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Items module
import ItemListPage from './pages/ItemListPage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Toaster position="top-center" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Public Landing Page */}
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/items" element={<ItemListPage />} />

        {/* Protected Item Routes */}
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
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
