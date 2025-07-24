# Firebase Setup Guide for Campus Bites

## 🔥 **Step 1: Enable Authentication Providers**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `campus-bites-b96d3`
3. Go to **Authentication** → **Sign-in method**
4. Enable these providers:
   - **Email/Password** ✅
   - **Google** ✅
   - **Apple** ✅ (optional)

### For Google Authentication:
1. Click on **Google** provider
2. Enable it
3. Add your authorized domains:
   - `localhost` (for development)
   - `campus-bites-b96d3.firebaseapp.com`
   - Your production domain

### For Apple Authentication:
1. Click on **Apple** provider
2. Enable it
3. Add your authorized domains

## 🔥 **Step 2: Configure Firestore Security Rules**

1. Go to **Firestore Database** → **Rules**
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read menu items
    match /menuItems/{itemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow authenticated users to read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Allow authenticated users to read combo offers
    match /comboOffers/{comboId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow authenticated users to read staff data (for admin)
    match /staff/{staffId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow authenticated users to read/write credit accounts
    match /creditAccounts/{accountId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

3. Click **Publish**

## 🔥 **Step 3: Create Initial Data**

### Create Menu Items Collection:
1. Go to **Firestore Database** → **Data**
2. Create a collection called `menuItems`
3. Add some sample menu items with this structure:

```json
{
  "name": "Chicken Biryani",
  "price": 180,
  "image": "https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=400",
  "description": "Aromatic rice dish with tender chicken and spices",
  "category": "Main Course",
  "available": true,
  "preparationTime": 20,
  "stockQuantity": 50,
  "costPrice": 120,
  "averageRating": 4.5,
  "totalReviews": 25,
  "salesCount": 150
}
```

### Create Combo Offers Collection:
1. Create a collection called `comboOffers`
2. Add sample combo offers

## 🔥 **Step 4: Test Authentication**

1. Start your development server: `npm run dev`
2. Go to `http://localhost:5176/`
3. Try logging in with Google
4. Check the browser console for any errors

## 🔥 **Step 5: Troubleshooting**

### If Google Login Still Fails:
1. Check if popups are blocked in your browser
2. Make sure `localhost` is in authorized domains
3. Check browser console for specific error codes

### If Menu Data Still Fails to Load:
1. Check Firestore rules are published
2. Verify the collections exist
3. Check browser console for permission errors

### Common Error Codes:
- `auth/popup-closed-by-user`: User closed the popup
- `auth/popup-blocked`: Browser blocked the popup
- `auth/unauthorized-domain`: Domain not authorized
- `auth/network-request-failed`: Network connectivity issue

## 🔥 **Step 6: Production Setup**

For production deployment:
1. Add your production domain to authorized domains
2. Update security rules if needed
3. Set up proper CORS configuration
4. Configure proper error handling

## 🔥 **Support**

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify all Firebase services are enabled
3. Ensure your Firebase project is on the Blaze plan (if using external APIs)
4. Check network connectivity and firewall settings 