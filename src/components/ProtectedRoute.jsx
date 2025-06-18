// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component is a wrapper that guards routes
 * based on authentication and OTP verification status.
 *
 * Props:
 * - children: The component to render if access is granted.
 * - requiresOTP: (boolean) If true, also checks for OTP verification.
 */
const ProtectedRoute = ({ children, requiresOTP = false }) => {
  const { isAuthenticated, isOTPVerified } = useAuth();

  // If the user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If OTP is required but not verified, redirect to OTP page
  if (requiresOTP && !isOTPVerified) {
    return <Navigate to="/otp-verify" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
