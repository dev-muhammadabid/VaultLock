import React, { createContext, useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from session storage
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user, authenticated, otpVerified } = JSON.parse(storedAuth);
        setCurrentUser(user);
        setIsAuthenticated(authenticated);
        setIsOTPVerified(otpVerified);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        sessionStorage.removeItem('auth');
      }
    }
  }, []);

  // Persist auth state to session storage
  useEffect(() => {
    sessionStorage.setItem('auth', JSON.stringify({
      user: currentUser,
      authenticated: isAuthenticated,
      otpVerified: isOTPVerified
    }));
  }, [currentUser, isAuthenticated, isOTPVerified]);

  // Register new user
  const register = (username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (users[username]) {
        return { success: false, message: 'Username already exists' };
      }

      // Hash password with salt
      const salt = CryptoJS.lib.WordArray.random(128/8).toString();
      const hashedPassword = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 1000
      }).toString();

      users[username] = { hashedPassword, salt };
      localStorage.setItem('users', JSON.stringify(users));
      
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  // Login user
  const login = (username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (!users[username]) {
        return { success: false, message: 'User not found' };
      }

      // Verify password
      const hashedPassword = CryptoJS.PBKDF2(password, users[username].salt, {
        keySize: 256/32,
        iterations: 1000
      }).toString();

      if (hashedPassword !== users[username].hashedPassword) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Generate and store OTP
      const otp = generateNewOTP();
      
      setCurrentUser(username);
      setIsAuthenticated(true);
      setIsOTPVerified(false);
      
      return { 
        success: true, 
        message: `OTP for verification: ${otp}`,
        otp 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  // Generate new OTP
  const generateNewOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    return otp;
  };

  // Verify OTP
  const verifyOTP = (inputOTP) => {
    try {
      if (!generatedOTP) {
        return { success: false, message: 'No active OTP found' };
      }
      
      if (inputOTP === generatedOTP) {
        setIsOTPVerified(true);
        setGeneratedOTP(null); // Clear OTP after successful verification
        navigate('/dashboard');
        return { success: true, message: 'OTP verified successfully' };
      }
      
      return { success: false, message: 'Invalid OTP' };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'OTP verification failed' };
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOTPVerified(false);
    setGeneratedOTP(null);
    sessionStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isOTPVerified,
      generatedOTP,
      register,
      login,
      logout,
      generateNewOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);