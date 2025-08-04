import React from 'react';
import HealthCheck from './HealthCheck';

const TestPage = () => {
  const testInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    userAgent: navigator.userAgent,
    url: window.location.href,
    localStorage: {
      hasToken: !!localStorage.getItem('token')
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🚀 TaskFlow Pro - System Test
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">✅ Frontend Status</h2>
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800">
                  React app is loading successfully!
                </p>
                <p className="text-sm text-green-600 mt-2">
                  If you can see this page, the frontend deployment is working.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">🔧 System Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(testInfo, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">🧪 Quick Tests</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/login"
                className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded"
              >
                Test Login Page
              </a>
              <a
                href="/register"
                className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded"
              >
                Test Register Page
              </a>
              <a
                href="/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-purple-500 hover:bg-purple-600 text-white text-center py-3 px-4 rounded"
              >
                Test API Health
              </a>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Next Steps:</h3>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Test the API health endpoint</li>
              <li>Try logging in or registering</li>
              <li>Check browser console for any errors</li>
              <li>Verify environment variables in Vercel dashboard</li>
            </ol>
          </div>
        </div>
      </div>
      
      <HealthCheck />
    </div>
  );
};

export default TestPage;
