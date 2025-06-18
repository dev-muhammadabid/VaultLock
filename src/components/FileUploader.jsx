// src/components/FileUploader.js
import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useDocuments } from '../context/DocumentContext';

const FileUploader = () => {
  // State to manage selected file
  const [file, setFile] = useState(null);
  
  // Uploading state and feedback message
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Function to upload file from context
  const { uploadDocument } = useDocuments();

  // Triggered when a user selects a file
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage({ type: '', text: '' }); // Clear previous messages
    }
  };

  // Handles file upload when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate file presence
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    // Begin upload
    setIsUploading(true);

    // Attempt to upload and show result message
    const result = await uploadDocument(file);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    setIsUploading(false);

    // Reset form on success
    if (result.success) {
      setFile(null);
      e.target.reset(); // Clear file input
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Upload Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a file to upload
          </label>

          {/* Custom file input with drag-and-drop style */}
          <div className="flex items-center">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, PNG, JPG (MAX. 10MB)
                </p>
              </div>

              {/* Hidden actual file input */}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Preview selected file */}
        {file && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 truncate">
              <span className="font-medium">Selected file:</span> {file.name}
            </p>
            <p className="text-xs text-gray-500">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Feedback message after upload attempt */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            !file || isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Encrypt & Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
