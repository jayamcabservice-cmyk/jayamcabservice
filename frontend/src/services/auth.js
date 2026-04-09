import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

import { auth } from '../config/firebase';

// Backend API URL - update this to your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Reset admin password via Firebase Email link
 */
export const resetAdminPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Login with email and password
 * Uses Firebase Client Auth to verify password securely, then syncs with backend
 */
export const loginWithEmail = async (email, password) => {
  try {
    // 1. Securely verify credentials with Google Firebase Auth first!
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    // 2. Send token to backend to sync the admin status in Firestore
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login verification failed on server');
    }
    
    // 3. Keep the token for API requests
    localStorage.setItem('authToken', idToken);
    localStorage.setItem('adminEmail', email);
    
    return {
      success: true,
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      token: idToken,
    };
  } catch (error) {
    console.error('Login error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Phone login left intact but no longer relevant to Google.
 */

/**
 * Login with Phone Number (No OTP - Direct login)
 * Backend handles phone authentication
 */
export const loginWithPhone = async (phoneNumber) => {
  try {
    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;
    
    // Send phone number to backend for authentication
    const response = await fetch(`${API_URL}/api/auth/phone/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: formattedPhone }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Phone login failed');
    }
    
    // Exchange custom token for Firebase ID token
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    const idToken = await userCredential.user.getIdToken();
    
    // Store token
    localStorage.setItem('authToken', idToken);
    localStorage.setItem('adminPhone', formattedPhone);
    
    return {
      success: true,
      uid: userCredential.user.uid,
      phoneNumber: formattedPhone,
      token: idToken,
    };
  } catch (error) {
    console.error('Phone login error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminPhone');
    // Clear PIN verification
    sessionStorage.removeItem('adminPinVerified');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
