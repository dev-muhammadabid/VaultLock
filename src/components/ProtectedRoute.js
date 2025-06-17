// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiresOTP = false }) => {
  const { isAuthenticated, isOTPVerified } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiresOTP && !isOTPVerified) {
    return <Navigate to="/otp-verify" replace />;
  }
  
  return children;
};

export default ProtectedRoute;