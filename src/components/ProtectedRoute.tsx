import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
  allowedRoles?: ('student' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth, 
  allowedRoles = [] 
}) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but shouldn't be (e.g., on login page)
  if (!requireAuth && currentUser) {
    return <Navigate to="/menu" replace />;
  }

  // If role-based access is required
  if (requireAuth && allowedRoles.length > 0 && userData) {
    if (!allowedRoles.includes(userData.role)) {
      // Redirect based on user role
      if (userData.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/menu" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 