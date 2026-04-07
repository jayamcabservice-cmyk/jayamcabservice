const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes are protected and require admin privileges

// Get all history logs with pagination
router.get('/', 
  verifyToken, 
  isAdmin, 
  historyController.getHistoryLogs
);

// Get history for specific item
router.get('/:entityType/:itemId', 
  verifyToken, 
  isAdmin, 
  historyController.getItemHistory
);

module.exports = router;
