import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';

// Firebase configuration for travelapp-8e120 project
const firebaseConfig = {
  apiKey: "AIzaSyDq6PSDQIrd5Tx6RkuicE7BQb652-rGAsY",
  authDomain: "travelapp-8e120.firebaseapp.com",
  projectId: "travelapp-8e120",
  storageBucket: "travelapp-8e120.firebasestorage.app",
  messagingSenderId: "498930978814",
  appId: "1:498930978814:web:8d38569c7ad5281ca73aaf",
  measurementId: "G-6E206XNZ31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider(auth);

export default app;
