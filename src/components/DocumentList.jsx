// React and hooks
import React, { useState } from 'react';

// Icons from react-icons
import { FiFile, FiDownload, FiTrash2, FiLock, FiAlertCircle } from 'react-icons/fi';

// Context hooks for accessing documents and authentication state
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

const DocumentList = () => {
  // Getting state and functions from DocumentContext
  const { documents, isLoading, downloadDocument, deleteDocument } = useDocuments();
  
  // Getting OTP from AuthContext
  const { generatedOTP } = useAuth();

  // Local component states
  const [otpInput, setOtpInput] = useState(''); // Stores OTP input
  const [selectedDoc, setSelectedDoc] = useState(null); // Currently selected doc for download
  const [message, setMessage] = useState({ type: '', text: '' }); // Feedback message
  const [isDownloading, setIsDownloading] = useState(false); // Flag for download in progress
  const [isDeleting, setIsDeleting] = useState(null); // ID of doc being deleted

  // Handles document download with OTP verification
  const handleDownload = async (docId) => {
    if (!otpInput) {
      setMessage({ type: 'error', text: 'Please enter OTP' });
      return;
    }

    setIsDownloading(true);
    const result = await downloadDocument(docId, otpInput); // Download function from context
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setIsDownloading(false);

    if (result.success) {
      setOtpInput('');
      setSelectedDoc(null); // Close OTP modal on success
    }
  };

  // Handles document deletion
  const handleDelete = async (docId) => {
    setIsDeleting(docId); // Mark this doc as "deleting"
    await deleteDocument(docId); // Delete function from context
    setIsDeleting(null);
  };

  // Utility: Formats upload date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Utility: Converts file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show spinner while loading and no documents yet
  if (isLoading && documents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show "no documents" message if list is empty
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FiFile className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload your first document to get started.
        </p>
      </div>
    );
  }

  // Main document list UI
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header section */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
        <p className="mt-1 text-sm text-gray-500">
          All files are encrypted and securely stored
        </p>
      </div>

      {/* Document list */}
      <div className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
            {/* File info section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FiFile className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {doc.fileName}
                  </h3>
                  <FiLock className="ml-2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Uploaded: {formatDate(doc.uploadDate)} • {formatFileSize(doc.size)}
                </p>
              </div>
            </div>

            {/* Action buttons: Download and Delete */}
            <div className="flex space-x-2">
              {/* Download button opens OTP modal */}
              <button
                onClick={() => setSelectedDoc(doc)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <FiDownload className="mr-1.5 h-4 w-4" />
                Download
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(doc.id)}
                disabled={isDeleting === doc.id}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:bg-red-400"
              >
                {isDeleting === doc.id ? (
                  <>
                    {/* Loading spinner for delete */}
                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OTP Modal for secure download */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  OTP Verification
                </h3>
                <button 
                  onClick={() => {
                    setSelectedDoc(null);
                    setMessage({ type: '', text: '' });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {/* Close icon */}
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* OTP guidance and OTP display (for demo/dev purposes) */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      For security reasons, OTP is required to decrypt and download files.
                      {generatedOTP && (
                        <span className="block mt-1 font-medium">
                          Your OTP: {generatedOTP}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP input field */}
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otpInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // only digits
                    setOtpInput(value);
                    setMessage({ type: '', text: '' });
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
                  placeholder="123456"
                />
              </div>

              {/* Success or error message */}
              {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoc(null);
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDownload(selectedDoc.id)}
                  disabled={isDownloading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isDownloading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isDownloading ? 'Decrypting...' : 'Decrypt & Download'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
