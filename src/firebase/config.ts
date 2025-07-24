import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB8gXMCBgSlfe-MSGrPaW5afmY2hTTL1fQ",
  authDomain: "campus-bites-b96d3.firebaseapp.com",
  projectId: "campus-bites-b96d3",
  storageBucket: "campus-bites-b96d3.firebasestorage.app",
  messagingSenderId: "660093328094",
  appId: "1:660093328094:web:f9d7a2805121e900a9404f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 