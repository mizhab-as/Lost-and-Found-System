import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Header({ viewMode, setViewMode }) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const isDark = theme === 'dark';

  return (
    <header className={`${isDark ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'} shadow-lg`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lost & Found System</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            {isDark ? '🌞 Light' : '🌙 Dark'}
          </button>

          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 ${
                viewMode === 'user'
                  ? isDark ? 'bg-gray-900' : 'bg-blue-700'
                  : isDark ? 'bg-gray-700' : 'bg-blue-500'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 ${
                viewMode === 'admin'
                  ? isDark ? 'bg-gray-900' : 'bg-blue-700'
                  : isDark ? 'bg-gray-700' : 'bg-blue-500'
              }`}
            >
              Admin
            </button>
          </div>

          {isAuthenticated && (
            <button
              onClick={logout}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
              }`}
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