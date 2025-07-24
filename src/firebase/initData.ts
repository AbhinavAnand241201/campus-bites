import { db } from './config';
import { collection, addDoc, serverTimestamp, getDocs, writeBatch, doc } from 'firebase/firestore';
import { menuItems, comboOffers, staffMembers, creditAccounts } from '../lib/sampleData';

export const initializeFirebaseData = async () => {
  try {
    console.log('Initializing Firebase database with sample data...');

    // Initialize Menu Items
    console.log('Adding menu items...');
    for (const item of menuItems) {
      await addDoc(collection(db, 'menuItems'), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Initialize Combo Offers
    console.log('Adding combo offers...');
    for (const combo of comboOffers) {
      await addDoc(collection(db, 'comboOffers'), {
        ...combo,
        createdAt: serverTimestamp()
      });
    }

    // Initialize Staff Members
    console.log('Adding staff members...');
    for (const staff of staffMembers) {
      await addDoc(collection(db, 'staff'), {
        ...staff,
        createdAt: serverTimestamp()
      });
    }

    // Initialize Credit Accounts
    console.log('Adding credit accounts...');
    for (const account of creditAccounts) {
      await addDoc(collection(db, 'creditAccounts'), {
        ...account,
        createdAt: serverTimestamp()
      });
    }

    console.log('Firebase database initialized successfully!');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
    throw error;
  }
};

// Function to check if data already exists
export const checkDataExists = async () => {
  try {
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    return !menuItemsSnapshot.empty;
  } catch (error) {
    console.error('Error checking data existence:', error);
    return false;
  }
};

// Function to clear all data (for development)
export const clearAllData = async () => {
  try {
    console.log('Clearing all data from Firebase...');
    
    const collections = ['menuItems', 'comboOffers', 'staff', 'creditAccounts', 'orders', 'users'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      
      await batch.commit();
    }
    
    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}; 