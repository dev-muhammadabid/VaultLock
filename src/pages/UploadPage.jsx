// src/pages/UploadPage.js
import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import FileUploader from '../components/FileUploader';

export default function UploadPage() {
  const { uploadDocument } = useDocuments();
  return (
    <div className="mx-auto max-w-lg p-4">
      <h2>Upload</h2>
      <FileUploader onUpload={uploadDocument} />
    </div>
  );
}
