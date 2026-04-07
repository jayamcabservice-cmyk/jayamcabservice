const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected route - requires authentication
router.post('/', 
  verifyToken,
  upload.single('image'), 
  uploadController.uploadImage
);

module.exports = router;
