import React, { useState } from 'react';

// Custom context hooks
import { useDocuments, useAuth } from '../context';

// Icons
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

const DownloadModal = ({ docId, onClose }) => {
  // Local state for OTP input, error message, and loading flag
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Context hooks
  const { downloadDocument } = useDocuments();
  const { generatedOTP } = useAuth();

  // Handles secure file download with OTP
  const handleDownload = async () => {
    // Validate OTP format (must be 6 digits)
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Attempt to download the document using the provided OTP
      await downloadDocument(docId, otp);
      onClose(); // Close modal on success
    } catch (err) {
      // Display any errors returned by the download attempt
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Enter OTP to Download</h3>

        {/* OTP display for development or demo use */}
        {generatedOTP && (
          <div className="bg-blue-50 p-3 rounded mb-4 flex items-start">
            <FiAlertCircle className="text-blue-500 mr-2 mt-0.5" />
            <span>Use OTP: <strong>{generatedOTP}</strong></span>
          </div>
        )}

        {/* OTP input field */}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Only digits, max 6 chars
          placeholder="Enter 6-digit OTP"
          className="w-full p-2 border rounded mb-4 text-center text-xl"
        />

        {/* Error message display */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Action buttons */}
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

export default DownloadModal;
