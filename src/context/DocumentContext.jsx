// src/context/DocumentContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { useAuth } from './AuthContext';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Currently authenticated user
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState(null); // IndexedDB instance

  // Initialize the IndexedDB database on component mount
  useEffect(() => {
    const initDB = async () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('SecureVaultDB', 1);

        request.onerror = (event) => {
          console.error('Database error:', event.target.error);
          reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Create object store with keyPath and user index
          if (!db.objectStoreNames.contains('documents')) {
            const store = db.createObjectStore('documents', { keyPath: 'id' });
            store.createIndex('user', 'user', { unique: false });
          }
        };

        request.onsuccess = (event) => {
          setDb(event.target.result); // Save db instance to state
          resolve(event.target.result);
        };
      });
    };

    initDB().catch(console.error);
  }, []);

  // Load all documents associated with currentUser
  const loadDocuments = async () => {
    if (!db || !currentUser) return;

    setIsLoading(true);
    try {
      const transaction = db.transaction('documents', 'readonly');
      const store = transaction.objectStore('documents');
      const index = store.index('user');
      const request = index.getAll(currentUser);

      request.onsuccess = (event) => {
        setDocuments(event.target.result || []);
        setIsLoading(false);
      };

      request.onerror = (event) => {
        console.error('Error loading documents:', event.target.error);
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error loading documents:', error);
      setIsLoading(false);
    }
  };

  // Upload document: read, encrypt, and store it
  const uploadDocument = async (file) => {
    if (!db || !currentUser) {
      return { success: false, message: 'User not authenticated' };
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onload = async (event) => {
          try {
            const fileData = event.target.result;

            // Encrypt file content using AES with username as key (⚠️ Consider using a better secret key strategy)
            const encryptedData = CryptoJS.AES.encrypt(
              CryptoJS.lib.WordArray.create(fileData),
              currentUser
            ).toString();

            const document = {
              id: Date.now().toString(),
              user: currentUser,
              fileName: file.name,
              fileType: file.type,
              encryptedData,
              uploadDate: new Date().toISOString(),
              size: file.size
            };

            const transaction = db.transaction('documents', 'readwrite');
            const store = transaction.objectStore('documents');
            store.add(document);

            transaction.oncomplete = () => {
              setDocuments(prev => [...prev, document]);
              setIsLoading(false);
              resolve({ success: true, message: 'Document uploaded successfully' });
            };

            transaction.onerror = (event) => {
              console.error('Error saving document:', event.target.error);
              setIsLoading(false);
              resolve({ success: false, message: 'Failed to save document' });
            };
          } catch (error) {
            console.error('Encryption failed:', error);
            setIsLoading(false);
            resolve({ success: false, message: 'Encryption failed' });
          }
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setIsLoading(false);
      return { success: false, message: 'Upload failed' };
    }
  };

  // Download and decrypt a document by ID (requires OTP)
  const downloadDocument = (documentId, otp) => {
    setIsLoading(true);
    const doc = documents.find(doc => doc.id === documentId);

    if (!doc) {
      setIsLoading(false);
      return { success: false, message: 'Document not found' };
    }

    // ✅ TEMPORARY OTP: Replace with dynamic OTP in production
    if (otp !== '123456') {
      setIsLoading(false);
      return { success: false, message: 'Invalid OTP' };
    }

    try {
      const decryptedData = CryptoJS.AES.decrypt(
        doc.encryptedData,
        currentUser
      );

      // Convert decrypted data to byte array
      const wordArray = decryptedData;
      const arrayBuffer = new Uint8Array(wordArray.sigBytes);
      for (let i = 0; i < wordArray.sigBytes; i++) {
        arrayBuffer[i] = wordArray.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8) & 0xff;
      }

      // Create and download file
      const blob = new Blob([arrayBuffer], { type: doc.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsLoading(false);
      return { success: true, message: 'Document downloaded successfully' };
    } catch (error) {
      console.error('Decryption failed:', error);
      setIsLoading(false);
      return { success: false, message: 'Decryption failed' };
    }
  };

  // Delete a document from DB and state
  const deleteDocument = async (documentId) => {
    if (!db) return;

    setIsLoading(true);
    try {
      const transaction = db.transaction('documents', 'readwrite');
      const store = transaction.objectStore('documents');
      store.delete(documentId);

      transaction.oncomplete = () => {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        setIsLoading(false);
      };

      transaction.onerror = (event) => {
        console.error('Error deleting document:', event.target.error);
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Delete failed:', error);
      setIsLoading(false);
    }
  };

  // Load documents when db or currentUser changes
  useEffect(() => {
    if (currentUser && db) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [currentUser, db]);

  return (
    <DocumentContext.Provider value={{
      documents,
      isLoading,
      uploadDocument,
      downloadDocument,
      deleteDocument
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use document functions
export const useDocuments = () => useContext(DocumentContext);
