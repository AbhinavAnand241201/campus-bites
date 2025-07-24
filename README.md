# Campus Bites - Pre-Order Web App

A modern, responsive web application that allows students to pre-order food from their campus canteen, skip the queue, and enjoy a seamless dining experience.

## 🚀 Features

- **Instant Ordering**: Browse menu and place orders with one click
- **Campus Wallet System**: Pre-loaded wallet for frictionless payments
- **QR Code Pickup**: Unique QR codes for secure order collection
- **Real-time Updates**: Live order status tracking
- **Admin Dashboard**: Complete management system for canteen staff
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Auth, Functions)
- **Charts**: Recharts
- **QR Code**: qrcode.react
- **Build Tool**: Vite

## 📦 Installation

1. **Install Node.js** (if not already installed):
   ```bash
   # Download from https://nodejs.org/
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a new Firebase project
   - Enable Firestore Database
   - Enable Authentication (Email/Password and Google)
   - Update `src/firebase/config.ts` with your Firebase config

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── assets/        # Static assets
└── firebase/      # Firebase configuration
```

## 📱 User Journey

### For Students:
1. **Top-up Wallet**: Add credit at the canteen counter
2. **Browse Menu**: View available items with real-time availability
3. **Place Order**: Add items to cart and select pickup time
4. **Instant Payment**: Order is paid from wallet balance
5. **QR Pickup**: Show QR code for order collection

### For Admins:
1. **Manage Wallets**: Add credit to student accounts
2. **View Orders**: Real-time order feed with status updates
3. **Update Status**: Mark orders as preparing/ready
4. **Scan QR**: Verify and complete orders

## 🔧 Development Plan

This project follows a 7-day development sprint:

- **Day 1**: Foundation & Landing Page ✅
- **Day 2**: Authentication & User Roles
- **Day 3**: Admin Command Center
- **Day 4**: Student Menu & Cart
- **Day 5**: Instant Checkout Flow
- **Day 6**: Order Tracking & QR Codes
- **Day 7**: Dashboard & Final Polish

## 🚀 Deployment

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 📄 License

MIT License - feel free to use this project for your campus!

## 🤝 Contributing

This is a learning project. Feel free to fork and improve! 