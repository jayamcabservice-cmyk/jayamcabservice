const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.registerAdmin);
router.post('/login', authController.loginWithEmail);  // NEW: Email/password login
router.post('/phone/login', authController.loginWithPhone); // No OTP login
router.post('/google', authController.googleLogin);
router.post('/phone/send-otp', authController.sendPhoneOTP);
router.post('/phone/verify', authController.verifyPhoneOTP);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentAdmin);
router.post('/logout', verifyToken, authController.logoutAdmin);

module.exports = router;
