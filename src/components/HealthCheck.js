import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HealthCheck = () => {
  const [health, setHealth] = useState({
    api: 'checking',
    frontend: 'ok',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await api.get('/health');
      setHealth(prev => ({
        ...prev,
        api: 'ok',
        apiResponse: response.data
      }));
    } catch (error) {
      console.error('API Health Check Failed:', error);
      setHealth(prev => ({
        ...prev,
        api: 'error',
        apiError: error.message,
        apiStatus: error.response?.status,
        apiUrl: error.config?.baseURL + error.config?.url
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return '✅';
      case 'error': return '❌';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">System Health</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Frontend:</span>
          <span className={`${getStatusColor(health.frontend)} font-medium`}>
            {getStatusIcon(health.frontend)} {health.frontend}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>API:</span>
          <span className={`${getStatusColor(health.api)} font-medium`}>
            {getStatusIcon(health.api)} {health.api}
          </span>
        </div>
        
        {health.api === 'error' && (
          <div className="mt-2 p-2 bg-red-50 rounded text-xs">
            <div><strong>Error:</strong> {health.apiError}</div>
            {health.apiStatus && <div><strong>Status:</strong> {health.apiStatus}</div>}
            {health.apiUrl && <div><strong>URL:</strong> {health.apiUrl}</div>}
          </div>
        )}
        
        {health.apiResponse && (
          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
            <div><strong>API Status:</strong> {health.apiResponse.status}</div>
            <div><strong>Timestamp:</strong> {new Date(health.apiResponse.timestamp).toLocaleTimeString()}</div>
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
          Environment: {process.env.NODE_ENV || 'development'}
        </div>
        
        <button
          onClick={checkAPIHealth}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
        >
          Recheck API
        </button>
      </div>
    </div>
  );
};

export default HealthCheck;
