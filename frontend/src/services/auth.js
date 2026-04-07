import { 
  signInWithCustomToken,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Backend API URL - update this to your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Register admin with email and password
 * Backend handles Firebase Admin SDK user creation
 */
export const registerWithEmail = async (email, password, name) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
    }
    
    // Backend returns custom token - exchange it for Firebase ID token
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    const idToken = await userCredential.user.getIdToken();
    
    return {
      success: true,
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      token: idToken,
    };
  } catch (error) {
    console.error('Registration error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Login with email and password
 * Backend verifies credentials and returns custom token
 */
export const loginWithEmail = async (email, password) => {
  try {
    // Send credentials to backend for verification
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Exchange custom token for Firebase ID token
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    const idToken = await userCredential.user.getIdToken();
    
    // Store the Firebase ID token for API requests
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
 * Login with Google
 * Backend verifies and creates session
 */
export const loginWithGoogle = async () => {
  try {
    // For Google auth, we'll still use popup but backend will verify
    // This is a simplified version - full implementation would handle Google OAuth on backend
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    
    // Send to backend for admin verification and custom token
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Google login failed');
    }
    
    // Exchange custom token for fresh Firebase ID token
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    const finalIdToken = await userCredential.user.getIdToken();
    
    localStorage.setItem('authToken', finalIdToken);
    
    return {
      success: true,
      uid: result.user.uid,
      email: result.user.email,
      token: finalIdToken,
    };
  } catch (error) {
    console.error('Google login error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

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
