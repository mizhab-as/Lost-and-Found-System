import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function AdminDashboard({ items = [], onItemUpdated }) {
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Safely filter items only if they exist
  const filteredItems = items?.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return item.status === 'Pending';
    if (activeTab === 'lost') return item.status === 'Lost';
    if (activeTab === 'found') return item.status === 'Found';
    return true;
  }) || [];

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'lost', 'found'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          <thead>
            <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Reporter</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No items found</td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className={isDark ? 'border-gray-700' : 'border-gray-200'}>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">{item.reporterName}</td>
                  <td className="px-6 py-4">
                    {/* Add action buttons here */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;