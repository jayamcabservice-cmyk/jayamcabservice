const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes are protected and require admin privileges

// Get all vehicles (public can read)
router.get('/', vehicleController.getAllVehicles);

// Get single vehicle (public can read)
router.get('/:id', vehicleController.getVehicleById);

// Create vehicle (admin only)
router.post('/', 
  verifyToken, 
  isAdmin, 
  vehicleController.createVehicle
);

// Update vehicle (admin only)
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  vehicleController.updateVehicle
);

// Delete vehicle (admin only)
router.delete('/:id', 
  verifyToken, 
  isAdmin, 
  vehicleController.deleteVehicle
);

module.exports = router;
