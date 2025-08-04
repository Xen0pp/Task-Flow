import React, { useState } from 'react';
import { Users, Clipboard, ClipboardCheck } from 'lucide-react';

function OrganizationManagement({ organization }) {
  const [copied, setCopied] = useState(false);

  if (!organization) {
    return <div>Loading organization details...</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(organization.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 md:-m-6 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{organization.name}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Invite Code</h3>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <span className="font-mono text-primary-500 dark:text-primary-400 text-lg tracking-wider">{organization.inviteCode}</span>
          <button onClick={handleCopy} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 relative">
            {copied ? <ClipboardCheck size={20} className="text-green-500" /> : <Clipboard size={20} className="text-gray-600 dark:text-gray-300" />}
          </button>
        </div>
        {copied && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Copied to clipboard!</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <Users className="mr-2" size={22} /> Members ({organization.members.length})
        </h3>
        <ul className="space-y-3">
          {organization.members.map((member) => (
            <li key={member._id} className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                <span className="font-bold text-primary-600 dark:text-primary-300">{member.name ? member.name.charAt(0).toUpperCase() : '?'}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{member.name || 'Unnamed User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default OrganizationManagement;
