const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route - anyone can create booking
router.post('/', bookingController.createBooking);

// Protected routes - admin only
router.get('/', 
  verifyToken, 
  isAdmin, 
  bookingController.getAllBookings
);

router.get('/:id', 
  verifyToken, 
  isAdmin, 
  bookingController.getBookingById
);

router.put('/:id', 
  verifyToken, 
  isAdmin, 
  bookingController.updateBooking
);

router.patch('/:id/status', 
  verifyToken, 
  isAdmin, 
  bookingController.updateBookingStatus
);

router.delete('/:id', 
  verifyToken, 
  isAdmin, 
  bookingController.deleteBooking
);

module.exports = router;
