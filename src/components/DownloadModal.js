import React, { useState } from 'react';
import { useDocuments, useAuth } from '../context';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

const DownloadModal = ({ docId, onClose }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { downloadDocument } = useDocuments();
  const { generatedOTP } = useAuth();

  const handleDownload = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await downloadDocument(docId, otp);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Enter OTP to Download</h3>
        
        {generatedOTP && (
          <div className="bg-blue-50 p-3 rounded mb-4 flex items-start">
            <FiAlertCircle className="text-blue-500 mr-2 mt-0.5" />
            <span>Use OTP: <strong>{generatedOTP}</strong></span>
          </div>
        )}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit OTP"
          className="w-full p-2 border rounded mb-4 text-center text-xl"
        />

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
          >
            {isLoading ? 'Decrypting...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};