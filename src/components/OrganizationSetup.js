import React, { useState } from 'react';
import organizationService from '../services/organizationService';
import { useAuth } from '../contexts/AuthContext';

const OrganizationSetup = ({ onSetupSuccess }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!organizationName.trim()) {
      setError('Organization name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await organizationService.createOrganization({ name: organizationName });
      await fetchUser(); // Refresh user data to get the new organization
    if (onSetupSuccess) onSetupSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization.');
    }
    setLoading(false);
  };

  const handleJoinOrganization = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Invite code is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await organizationService.joinOrganization({ inviteCode });
      await fetchUser(); // Refresh user data after joining the organization
    if (onSetupSuccess) onSetupSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join organization.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Welcome to TaskFlow Pro</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">To get started, create a new organization for your team or join an existing one.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Organization Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Create Organization</h2>
            <form onSubmit={handleCreateOrganization}>
              <div className="mb-4">
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                <input 
                  type="text"
                  id="orgName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Acme Inc."
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:bg-primary-300 transition-colors">
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
          </div>

          {/* Join Organization Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Join Organization</h2>
            <form onSubmit={handleJoinOrganization}>
              <div className="mb-4">
                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite Code</label>
                <input 
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter invite code"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-green-300 transition-colors">
                {loading ? 'Joining...' : 'Join Organization'}
              </button>
            </form>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mt-8">{error}</p>}
      </div>
    </div>
  );
};

export default OrganizationSetup;
