import React from 'react';
import { useAuth } from '../context/AuthContext';

function Header({ viewMode, setViewMode }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Lost & Found System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-blue-700 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 ${
                viewMode === 'user' ? 'bg-blue-900' : ''
              }`}
            >
              User View
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 ${
                viewMode === 'admin' ? 'bg-blue-900' : ''
              }`}
            >
              Admin
            </button>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;