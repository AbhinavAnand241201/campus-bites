import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentMenuPage from './pages/StudentMenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageWalletsPage from './pages/admin/ManageWalletsPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import InventoryManagementPage from './pages/admin/InventoryManagementPage';
import StaffAttendancePage from './pages/admin/StaffAttendancePage';
import ComboOffersPage from './pages/admin/ComboOffersPage';
import CreditSalesPage from './pages/admin/CreditSalesPage';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import CartSidebar from './components/CartSidebar';
import FloatingCartButton from './components/FloatingCartButton';
import ProtectedRoute from './components/ProtectedRoute';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading Campus Bites...</h2>
      <p className="text-gray-600 dark:text-gray-400">Please wait while we set up your experience</p>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're experiencing some technical difficulties. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
                    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <LoginPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <SignupPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/menu" 
                  element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                      <StudentMenuPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-confirmation/:orderId" 
                  element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-orders" 
                  element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  } 
                />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student', 'admin']}>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/cart"
                          element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['student']}>
                              <CartPage />
                            </ProtectedRoute>
                          }
                        />
                <Route 
                  path="/admin" 
                  element={
                            <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                                <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="menu" element={<MenuManagementPage />} />
                          <Route path="inventory" element={<InventoryManagementPage />} />
                          <Route path="combos" element={<ComboOffersPage />} />
                          <Route path="staff" element={<StaffAttendancePage />} />
                          <Route path="credit" element={<CreditSalesPage />} />
              <Route path="orders" element={<OrderManagementPage />} />
                          <Route path="wallets" element={<ManageWalletsPage />} />
                </Route>
              </Routes>
              
              {/* Global Cart Sidebar */}
              <CartSidebar />
                      
                      {/* Floating Cart Button */}
                      <FloatingCartButton />
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App; 