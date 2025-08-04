import React, { useState } from 'react';

const DebugInfo = () => {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  const debugInfo = {
    environment: process.env.NODE_ENV,
    apiUrl: process.env.REACT_APP_API_URL || 'Not set',
    currentUrl: window.location.href,
    userAgent: navigator.userAgent,
    localStorage: {
      token: localStorage.getItem('token') ? 'Present' : 'Not found'
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        Debug
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-black text-white p-4 rounded text-xs max-w-sm">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
