import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Import pages directly (no lazy loading)
import Home from './pages/Home';
import PackagesPage from './pages/PackagesPage';
import VehiclesPage from './pages/VehiclesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPinVerification from './pages/admin/AdminPinVerification';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageBookings from './pages/admin/ManageBookings';

// Protected Route Component - checks if user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// PIN Verification Component - checks if admin has verified PIN
const RequirePin = ({ children }) => {
  const isPinVerified = sessionStorage.getItem('adminPinVerified');
  
  if (!isPinVerified) {
    return <Navigate to="/admin/verify" replace />;
  }
  
  return children;
};

// Main Layout for public pages
const MainLayout = () => {
  const location = useLocation();
  
  // Clear PIN verification when on public pages
  React.useEffect(() => {
    // Only clear if not on admin routes
    if (!location.pathname.startsWith('/admin')) {
      sessionStorage.removeItem('adminPinVerified');
    }
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/verify" element={
          <AdminPinVerification />
        } />
        
        <Route path="/admin/login" element={
          <RequirePin>
            <AdminLogin />
          </RequirePin>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<ManagePackages />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
