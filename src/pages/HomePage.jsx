// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiShield, FiUpload, FiDownload, FiArrowRight, FiCheck } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Military-Grade Encryption",
      description: "All documents encrypted with AES-256 before storage",
      icon: <FiShield className="h-8 w-8" />
    },
    {
      title: "Zero-Knowledge Architecture",
      description: "Only you have access to your encryption keys",
      icon: <FiLock className="h-8 w-8" />
    },
    {
      title: "Secure Sharing",
      description: "Share files with OTP-protected links",
      icon: <FiUpload className="h-8 w-8" />
    },
    {
      title: "Anywhere Access",
      description: "Access your vault from any device",
      icon: <FiDownload className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${Math.random() * 10 + 5}s infinite`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg">
               <img src="/images/vaultlock-logo.png" alt="VaultLock Logo" className="h-12 w-18" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              VaultLock
            </span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 transition-all duration-1000 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
            The Future of <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Secure</span> Document Storage
          </h1>
          <p className={`max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12 transition-all duration-1000 delay-300 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
            Military-grade encryption meets intuitive design. Protect your sensitive documents with zero-knowledge security and blockchain-inspired architecture.
          </p>
          <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-500 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <span>Existing User?</span>
                <FiArrowRight className="ml-2" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise Security, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Simplified</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Our cutting-edge security architecture combines military-grade encryption with intuitive access controls
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature cards */}
            <div className="space-y-8">
              {features.slice(0, 2).map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-gray-700 transition-all duration-500 ${activeFeature === index ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${activeFeature === index ? 'bg-blue-500/20' : 'bg-gray-700'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-8">
              {features.slice(2, 4).map((feature, index) => (
                <div 
                  key={index+2}
                  className={`p-6 rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-gray-700 transition-all duration-500 ${activeFeature === index+2 ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}
                  onMouseEnter={() => setActiveFeature(index+2)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${activeFeature === index+2 ? 'bg-blue-500/20' : 'bg-gray-700'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Security Experts Worldwide
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Our security protocols have been audited and verified by industry leaders
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['AES-256 Encryption', 'Zero-Knowledge Proof', 'FIPS 140-2 Compliant', 'GDPR Ready'].map((badge, index) => (
              <div key={index} className="p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <FiCheck className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium">{badge}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-12 rounded-3xl backdrop-blur-lg border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-10">
            Join thousands of security-conscious users who trust VaultLock with their sensitive documents
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Sign In to Your Vault
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="p-2 rounded-lg">
                 <img src="/images/vaultlock-logo.png" alt="VaultLock Logo" className="h-12 w-18" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                VaultLock
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VaultLock. All rights reserved. 
              <span className="block mt-1 md:inline md:mt-0 md:ml-4">
                Zero-knowledge security for the modern world.
              </span>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Floating particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animation: `float ${Math.random() * 20 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-100px) translateX(50px) rotate(90deg); }
          50% { transform: translateY(-200px) translateX(0) rotate(180deg); }
          75% { transform: translateY(-100px) translateX(-50px) rotate(270deg); }
          100% { transform: translateY(0) translateX(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;