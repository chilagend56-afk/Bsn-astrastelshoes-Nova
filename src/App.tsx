import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { PreviewInvoice } from './pages/PreviewInvoice';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SystemSettingsProvider } from './contexts/SystemSettingsContext';
import { TitleUpdater } from './components/ui/TitleUpdater';
import { AIAssistant } from './components/ui/AIAssistant';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <SystemSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <TitleUpdater />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category/:categoryName" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/preview" element={<PreviewInvoice />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            </Routes>
            <AIAssistant />
            
          </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SystemSettingsProvider>
    </HelmetProvider>
  );
}

export default App;
