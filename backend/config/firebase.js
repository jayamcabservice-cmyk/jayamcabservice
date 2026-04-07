require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  // Use environment variables (recommended for production)
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  // Fallback to service account key file (development)
  try {
    const serviceAccount = require('./firebase-adminsdk.json');
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized (fallback to JSON file)');
  } catch (fallbackError) {
    console.error('❌ Fallback initialization also failed:', fallbackError.message);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
