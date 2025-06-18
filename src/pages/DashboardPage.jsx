import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import FileUploader from '../components/FileUploader';
import DocumentList from '../components/DocumentList';
import { FiLogOut, FiShield } from 'react-icons/fi';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const { isLoading } = useDocuments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                 <img src="/images/vaultlock-logo.png" alt="VaultLock Logo" className="h-12 w-18" />
                <span className="ml-2 text-xl font-bold text-gray-900">VaultLock</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                    Welcome, {currentUser}
                  </span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <FiLogOut className="mr-1.5 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Secure Document Vault</h1>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                  <FiShield className="mr-1 h-3 w-3" />
                  AES-256 Encryption
                </div>
              </div>
              <p className="text-gray-600">
                Upload and store your documents securely. All files are encrypted before storage and require OTP verification for access.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Upload New Document
                  </h2>
                  <FileUploader />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Features</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <FiShield className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>All files encrypted with AES-256 before storage</span>
                    </li>
                    <li className="flex items-start">
                      <FiShield className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>OTP verification required for all downloads</span>
                    </li>
                    <li className="flex items-start">
                      <FiShield className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>Passwords hashed with PBKDF2 and salted</span>
                    </li>
                    <li className="flex items-start">
                      <FiShield className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>No sensitive data stored in plain text</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <DocumentList />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;