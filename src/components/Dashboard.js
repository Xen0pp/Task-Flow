import React, { useState, useEffect } from 'react';
import { Sun, Moon, ListChecks, Trophy, LogOut, Users } from 'lucide-react';
import TodoList from './TodoList';
import HackathonLog from './HackathonLog';
import OrganizationSetup from './OrganizationSetup';
import OrganizationManagement from './OrganizationManagement';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('todo');

  const { user, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleOrgSetupSuccess = () => {
    window.location.reload();
  };

  if (!user || !user.organization) {
    return <OrganizationSetup onSetupSuccess={handleOrgSetupSuccess} />;
  }

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-500">TaskFlow Pro</h1>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('todo')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'todo' ? 'bg-white dark:bg-gray-900 text-primary-500' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                  <ListChecks className="inline-block w-5 h-5 mr-1"/>
                  To-Do List
                </button>
                <button 
                  onClick={() => setActiveTab('hackathon')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'hackathon' ? 'bg-white dark:bg-gray-900 text-primary-500' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                  <Trophy className="inline-block w-5 h-5 mr-1"/>
                  Hackathon Log
                </button>
                <button 
                  onClick={() => setActiveTab('organization')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'organization' ? 'bg-white dark:bg-gray-900 text-primary-500' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                  <Users className="inline-block w-5 h-5 mr-1"/>
                  Organization
                </button>
              </nav>
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={logout} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          {activeTab === 'todo' && <TodoList />}
          {activeTab === 'hackathon' && <HackathonLog />}
          {activeTab === 'organization' && <OrganizationManagement organization={user.organization} />}
        </main>

        <footer className="bg-white dark:bg-gray-800 mt-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} TaskFlow Pro. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
