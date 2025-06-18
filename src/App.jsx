// Importing routing components from React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing context providers for authentication and document management
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

// Importing application pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';

// Importing component that restricts access to protected routes
import ProtectedRoute from './components/ProtectedRoute';

// Importing global styles
import './App.css';

function App() {
  return (
    // Setting up the router for client-side navigation
    <Router>
      {/* Wrapping the app with authentication provider to manage user state */}
      <AuthProvider>
        {/* Wrapping the app with document provider to manage document-related state */}
        <DocumentProvider>
          {/* Main container with background and minimum height styling */}
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public route: home page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Public route: user registration */}
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Public route: user login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected route: OTP verification page, requires authentication */}
              <Route 
                path="/otp-verify" 
                element={
                  <ProtectedRoute>
                    <OTPVerificationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected route: dashboard, requires both authentication and OTP verification */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiresOTP>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route: redirects any unknown paths to the home page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DocumentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
