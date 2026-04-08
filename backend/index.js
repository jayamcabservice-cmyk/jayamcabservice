require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const packageRoutes = require('./routes/packages');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');
const historyRoutes = require('./routes/history');

// Import Firebase config (initializes Firebase)
require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:4173',
    'https://travel-kqnc.onrender.com',
    'https://www.jayamcabservice.com',
    'https://jayamcabservice.com',
    /\.onrender\.com$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/history', historyRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large', 
      message: 'Max file size is 10MB' 
    });
  }
  
  if (err.message.includes('image')) {
    return res.status(400).json({ 
      error: 'Invalid file type', 
      message: err.message 
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nAvailable endpoints:');
  console.log('  Auth:     POST /api/auth/register, /api/auth/login');
  console.log('  Upload:   POST /api/upload');
  console.log('  Packages: GET/POST/PUT/DELETE /api/packages');
  console.log('  Vehicles: GET/POST/PUT/DELETE /api/vehicles');
  console.log('  Bookings: GET/POST/PUT/DELETE /api/bookings');
  console.log('  History:  GET /api/history');
});
