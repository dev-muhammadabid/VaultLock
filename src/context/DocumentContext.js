import React, { createContext, useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { useAuth } from './AuthContext';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const { currentUser, generatedOTP } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState(null);

  // Initialize IndexedDB
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
          if (!db.objectStoreNames.contains('documents')) {
            const store = db.createObjectStore('documents', { keyPath: 'id' });
            store.createIndex('user', 'user', { unique: false });
          }
        };
        
        request.onsuccess = (event) => {
          setDb(event.target.result);
          resolve(event.target.result);
        };
      });
    };
    
    initDB().catch(console.error);
  }, []);

  // Load documents for current user
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

  // Upload and encrypt document
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
            
            // Encrypt file with AES
            const encryptedData = CryptoJS.AES.encrypt(
              CryptoJS.lib.WordArray.create(fileData),
              currentUser // Using username as key
            ).toString();
            
            // Create document object
            const document = {
              id: Date.now().toString(),
              user: currentUser,
              fileName: file.name,
              fileType: file.type,
              encryptedData,
              uploadDate: new Date().toISOString(),
              size: file.size
            };
            
            // Save to IndexedDB
            const transaction = db.transaction('documents', 'readwrite');
            const store = transaction.objectStore('documents');
            store.add(document);
            
            transaction.oncomplete = () => {
              setDocuments(prev => [...prev, document]);
              setIsLoading(false);
              resolve({ 
                success: true, 
                message: 'Document uploaded successfully' 
              });
            };
            
            transaction.onerror = (event) => {
              console.error('Error saving document:', event.target.error);
              setIsLoading(false);
              resolve({ 
                success: false, 
                message: 'Failed to save document' 
              });
            };
          } catch (error) {
            console.error('Encryption failed:', error);
            setIsLoading(false);
            resolve({ 
              success: false, 
              message: 'Encryption failed' 
            });
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

  // Download and decrypt document
  const downloadDocument = (documentId, otp) => {
    setIsLoading(true);
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      setIsLoading(false);
      return { success: false, message: 'Document not found' };
    }
    
    try {
      // Verify OTP before decryption
      if (otp !== generatedOTP) {
        setIsLoading(false);
        return { success: false, message: 'Invalid OTP' };
      }
      
      // Decrypt file
      const decryptedData = CryptoJS.AES.decrypt(
        document.encryptedData,
        currentUser
      );
      
      // Convert to ArrayBuffer
      const wordArray = decryptedData;
      const arrayBuffer = new Uint8Array(wordArray.sigBytes);
      for (let i = 0; i < wordArray.sigBytes; i++) {
        arrayBuffer[i] = wordArray.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8) & 0xff;
      }
      
      // Create blob and trigger download
      const blob = new Blob([arrayBuffer], { type: document.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName;
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

  // Delete document
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

  // Load documents when user changes
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

export const useDocuments = () => useContext(DocumentContext);