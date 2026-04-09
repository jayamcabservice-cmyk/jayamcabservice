import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';

// Firebase configuration for jayamcabservice-e5840 project
const firebaseConfig = {
  apiKey: "AIzaSyCHHcbqZUJwewho4Rb-dQWJFN2qbZ5cl34",
  authDomain: "jayamcabservice-e5840.firebaseapp.com",
  projectId: "jayamcabservice-e5840",
  storageBucket: "jayamcabservice-e5840.firebasestorage.app",
  messagingSenderId: "201379605901",
  appId: "1:201379605901:web:64f3596a3161fbc79761c4",
  measurementId: "G-JGGJJWM652"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider(auth);

export default app;
