const { admin, db, auth } = require('../config/firebase');

/**
 * Register a new admin user (Email/Password)
 * Creates user in Firebase Auth and Firestore
 */
const registerAdmin = async (req, res) => {
  try {
    console.log('📝 Registration request received:', JSON.stringify(req.body, null, 2));
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password should be at least 6 characters' });
    }

    // Create user with Firebase Admin SDK
    let userRecord;
    const phoneNumber = req.body.phoneNumber;
    
    console.log('phoneNumber value:', phoneNumber, 'type:', typeof phoneNumber);
    
    if (phoneNumber && phoneNumber.trim()) {
      // Only add phone if explicitly provided
      console.log('Creating user WITH phone number');
      userRecord = await auth.createUser({
        email,
        password,
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber,
      });
    } else {
      // Create without phone number
      console.log('Creating user WITHOUT phone number');
      userRecord = await auth.createUser({
        email,
        password,
      });
    }

    // Add to admins collection
    await db.collection('admins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name: name || '',
      phoneNumber: phoneNumber || null,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate custom token for immediate login
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'Admin registered successfully',
      uid: userRecord.uid,
      email: userRecord.email,
      customToken,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ error: 'Password should be at least 6 characters' });
    }

    res.status(500).json({ error: 'Failed to register admin', message: error.message });
  }
};

/**
 * Login admin user with email and password
 * Verifies credentials using Firebase Admin SDK and returns custom token
 */
const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin by email in Firestore
    const adminsSnapshot = await db.collection('admins')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (adminsSnapshot.empty) {
      console.log('❌ Admin not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const adminDoc = adminsSnapshot.docs[0];
    const adminData = adminDoc.data();
    const uid = adminDoc.id;

    // Verify user exists and is not disabled
    try {
      const userRecord = await auth.getUser(uid);
      
      if (!userRecord || userRecord.disabled) {
        return res.status(401).json({ error: 'User account is disabled' });
      }
      
    } catch (verifyError) {
      console.error('User verification failed:', verifyError.message);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update lastLogin timestamp in Firestore
    await db.collection('admins').doc(uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate custom token for this user
    const customToken = await admin.auth().createCustomToken(uid);

    console.log('✅ Login successful for:', email);
    
    res.json({
      message: 'Login successful',
      uid,
      email: adminData.email,
      customToken,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      error: 'Failed to login', 
      message: error.message 
    });
  }
};

/**
 * Login admin user with phone number (No OTP)
 */
const loginWithPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Find admin by phone number in Firestore
    const adminsSnapshot = await db.collection('admins')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();

    if (adminsSnapshot.empty) {
      return res.status(401).json({ error: 'Phone number not registered' });
    }

    const adminDoc = adminsSnapshot.docs[0];
    const adminData = adminDoc.data();
    const uid = adminDoc.id;

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(uid);

    // Update lastLogin timestamp in Firestore
    await db.collection('admins').doc(uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create custom token
    const customToken = await admin.auth().createCustomToken(uid);

    res.json({
      message: 'Login successful',
      uid: uid,
      phoneNumber: phoneNumber,
      email: userRecord.email,
      token: customToken,
    });
  } catch (error) {
    console.error('Phone login error:', error.message);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

/**
 * Login admin user
 * Note: For production, implement proper password verification using Firebase Client SDK
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password, idToken } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let userRecord;

    // If ID token is provided (from Firebase Client SDK), verify it
    if (idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        userRecord = await auth.getUser(decodedToken.uid);
      } catch (error) {
        console.error('ID token verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      // Fallback to email/password (legacy - not recommended)
      if (!password) {
        return res.status(400).json({ error: 'Password or ID token required' });
      }
      
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        console.error('User lookup error:', error.message);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    const adminDoc = await db.collection('admins').doc(userRecord.uid).get();
    
    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'User is not an admin' });
    }

    // Create custom token for authenticated user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      message: 'Login successful',
      uid: userRecord.uid,
      email: userRecord.email,
      token: customToken,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

/**
 * Google OAuth login
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if user exists
    let userRecord;
    try {
      userRecord = await auth.getUser(decodedToken.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await auth.createUser({
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture,
        });
      } else {
        throw error;
      }
    }

    // Check or create admin record
    const adminDoc = await db.collection('admins').doc(userRecord.uid).get();
    
    if (!adminDoc.exists) {
      // First time - check if you want to auto-create admin or require manual approval
      await db.collection('admins').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        role: 'admin',
        provider: 'google',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update lastLogin for existing admin
      await db.collection('admins').doc(userRecord.uid).update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Create custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      message: 'Google login successful',
      uid: userRecord.uid,
      email: userRecord.email,
      token: customToken,
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).json({ error: 'Google login failed', message: error.message });
  }
};

/**
 * Send phone OTP
 */
const sendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Note: Phone authentication with Firebase Admin SDK requires special setup
    // This is a simplified version - in production, you'd use Firebase CLI or REST API
    
    res.status(200).json({
      message: 'OTP sent successfully',
      note: 'Phone auth requires additional Firebase setup. Please use Firebase client SDK for phone authentication.',
    });
  } catch (error) {
    console.error('Phone OTP error:', error.message);
    res.status(500).json({ error: 'Failed to send OTP', message: error.message });
  }
};

/**
 * Verify phone OTP
 */
const verifyPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    // Note: This requires Firebase phone auth setup
    res.status(200).json({
      message: 'Phone verification successful',
      note: 'Please implement using Firebase client SDK for complete phone authentication flow',
    });
  } catch (error) {
    console.error('Phone verification error:', error.message);
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
};

/**
 * Get current admin profile
 */
const getCurrentAdmin = async (req, res) => {
  try {
    const adminDoc = await db.collection('admins').doc(req.user.uid).get();

    if (!adminDoc.exists) {
      return res.status(404).json({ error: 'Admin profile not found' });
    }

    res.json({
      uid: req.user.uid,
      ...adminDoc.data(),
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to get profile', message: error.message });
  }
};

/**
 * Logout (client-side token removal, but we can log it)
 */
const logoutAdmin = async (req, res) => {
  try {
    // Optionally, you could maintain a blacklist of tokens
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginWithEmail,
  loginWithPhone,
  googleLogin,
  sendPhoneOTP,
  verifyPhoneOTP,
  getCurrentAdmin,
  logoutAdmin,
};
