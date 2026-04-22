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

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  
  React.useEffect(() => {
    // 1. Immediate scroll upon route change
    window.scrollTo(0, 0);
    
    // 2. Delayed scroll to overpower React lazy loading / Suspense layout shifts
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, search, hash]);
  
  return null;
};

// Main Layout for public pages
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white w-full max-w-[100vw] overflow-x-hidden">
      <ScrollToTop />
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
        <Route path="/admin/login" element={<AdminLogin />} />
        
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
