# 🚀 Campus Bites - Deployment Guide

## Demo Mode Setup ✅

The app is now configured for **DEMO MODE** with:
- **Auto-login**: Automatically logs in as "Demo User" 
- **Mock Data**: All features work with local data
- **No Firebase**: Bypasses all authentication/database issues
- **Full Functionality**: All USP features are working

## 🎯 Demo Credentials (if needed)
- **Email**: `demo@campusbites.com`
- **Password**: `demo123`

## 📱 Features Ready for Demo

### **Student Side:**
- ✅ Menu browsing with images
- ✅ Food customization (spice level, sugar level)
- ✅ Add to cart functionality
- ✅ Cart management
- ✅ Checkout process
- ✅ Order tracking
- ✅ Profile & wallet management
- ✅ Reviews & ratings
- ✅ Group order bonuses
- ✅ Voice search
- ✅ AI recommendations

### **Admin Side:**
- ✅ Dashboard with analytics
- ✅ Menu management
- ✅ Inventory tracking
- ✅ Combo offers management
- ✅ Staff attendance tracking
- ✅ Credit sales management
- ✅ Order management
- ✅ Wallet management

## 🚀 Deploy to Vercel

### **Option 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy!
```

### **Option 2: GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### **Option 3: Drag & Drop**
1. Run `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag the `dist` folder to deploy

## 🔧 Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

## 📋 Demo Flow for Meeting

1. **Landing Page** → Show the beautiful UI
2. **Auto-login** → App automatically logs in as Demo User
3. **Menu Page** → Browse items, show customization
4. **Add to Cart** → Demonstrate cart functionality
5. **Profile Page** → Show wallet management
6. **Checkout** → Complete order process
7. **Admin Dashboard** → Show all admin features
8. **Mobile Responsive** → Test on mobile view

## 🎨 UI Features to Highlight
- Modern glassmorphism design
- Smooth animations
- Dark/light theme toggle
- Responsive design
- Loading skeletons
- Toast notifications
- Floating action buttons

## 🔄 After Demo - Next Steps
1. **Restore Firebase**: Replace mock auth with real Firebase
2. **Database Setup**: Configure Firestore properly
3. **Security Rules**: Set up proper permissions
4. **Production Data**: Replace mock data with real data

## 📞 Support
If anything breaks during demo:
- Check browser console for errors
- Refresh the page (auto-login will work)
- All data is local, so no server issues

**Good luck with your meeting! 🎉** 