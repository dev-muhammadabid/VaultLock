import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyOTP, generatedOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a 6-digit OTP' });
      return;
    }
    
    setIsSubmitting(true);
    const result = await verifyOTP(otp);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiShield className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two-Factor Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code you received
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {/* Test OTP Banner - Only shown in development */}
          {process.env.NODE_ENV === 'development' && generatedOTP && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-bold">Development Mode:</span> Use OTP: {generatedOTP}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setMessage({ type: '', text: '' });
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || otp.length !== 6
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button 
                onClick={() => setMessage({ type: 'info', text: 'Please try logging in again to receive a new OTP' })}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Request new OTP
              </button>
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;