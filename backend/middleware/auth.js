const { admin } = require('../config/firebase');

// Middleware to verify Firebase authentication token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        message: 'Please login to access this resource'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phoneNumber: decodedToken.phone_number,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }

    return res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const { db } = require('../config/firebase');
    const adminDoc = await db.collection('admins').doc(req.user.uid).get();

    if (!adminDoc.exists) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have admin privileges'
      });
    }

    const adminData = adminDoc.data();
    req.adminRole = adminData.role || 'admin';
    
    next();
  } catch (error) {
    console.error('Admin check error:', error.message);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to verify admin status'
    });
  }
};

module.exports = { verifyToken, isAdmin };
