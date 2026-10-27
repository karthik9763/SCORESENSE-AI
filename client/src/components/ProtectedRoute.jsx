import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen message="Authenticating session..." />;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());
    const userRole = String(user.role || '').toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
