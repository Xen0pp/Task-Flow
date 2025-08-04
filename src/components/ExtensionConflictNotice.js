import React, { useState, useEffect } from 'react';

const ExtensionConflictNotice = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [conflictingExtensions, setConflictingExtensions] = useState([]);

  useEffect(() => {
    // Check for common conflicting extensions
    const checkExtensions = () => {
      const extensions = [];
      
      // Check for MetaMask
      if (window.ethereum && window.ethereum.isMetaMask) {
        extensions.push('MetaMask');
      }
      
      // Check for other Web3 wallets
      if (window.ethereum && !window.ethereum.isMetaMask) {
        extensions.push('Web3 Wallet');
      }
      
      // Check for other common extensions that might interfere
      if (window.chrome && window.chrome.runtime) {
        // Extension detected but we can't identify which one
        // This is normal and doesn't necessarily mean conflict
      }
      
      if (extensions.length > 0) {
        setConflictingExtensions(extensions);
        
        // Only show notice if there were actual errors
        const hasExtensionErrors = sessionStorage.getItem('extensionErrors');
        if (hasExtensionErrors) {
          setShowNotice(true);
        }
      }
    };

    // Check after a short delay to ensure extensions are loaded
    setTimeout(checkExtensions, 1000);

    // Listen for extension-related errors
    const handleError = (event) => {
      if (
        event.error &&
        (event.error.message?.includes('MetaMask') ||
         event.error.message?.includes('chrome-extension://'))
      ) {
        sessionStorage.setItem('extensionErrors', 'true');
        setShowNotice(true);
      }
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (!showNotice) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-300 p-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-yellow-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Browser Extension Detected:</strong> {conflictingExtensions.join(', ')} may interfere with TaskFlow Pro.
              {' '}This is a display issue only - your data and functionality are not affected.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sessionStorage.removeItem('extensionErrors');
              setShowNotice(false);
            }}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              // Provide troubleshooting info
              alert(`Troubleshooting Tips:
              
1. The app works normally - this is just a display warning
2. You can safely ignore MetaMask connection errors
3. TaskFlow Pro doesn't use blockchain features
4. Try refreshing the page if you see any issues
5. Consider disabling Web3 extensions temporarily if problems persist

Your tasks and data are safe!`);
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionConflictNotice;
