const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes are protected and require admin privileges

// Get all packages (public can read)
router.get('/', packageController.getAllPackages);

// Get single package (public can read)
router.get('/:id', packageController.getPackageById);

// Create package (admin only)
router.post('/', 
  verifyToken, 
  isAdmin, 
  packageController.createPackage
);

// Update package (admin only)
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  packageController.updatePackage
);

// Delete package (admin only)
router.delete('/:id', 
  verifyToken, 
  isAdmin, 
  packageController.deletePackage
);

module.exports = router;
