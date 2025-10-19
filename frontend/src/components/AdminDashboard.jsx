import React, { useState } from 'react';
import { updateItemStatus, approveItemClaim } from '../api/itemsApi';
import { formatDate } from '../utils/dateUtils';

function AdminDashboard({ items, onItemUpdated }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return item.status === 'Pending';
    if (activeTab === 'lost') return item.status === 'Lost';
    if (activeTab === 'found') return item.status === 'Found';
    if (activeTab === 'returned') return item.status === 'Returned';
    return true;
  });

  const handleStatusUpdate = async (itemId, newStatus) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await updateItemStatus(itemId, newStatus);
      onItemUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update item status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveClaim = async (itemId, claimId) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await approveItemClaim(itemId, claimId);
      onItemUpdated();
    } catch (err) {
      setError(err.message || 'Failed to approve claim');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Admin Dashboard</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'all' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Items ({items.length})
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'pending' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Claims
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'lost' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('lost')}
          >
            Lost
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'found' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('found')}
          >
            Found
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'returned' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('returned')}
          >
            Returned
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No items found</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                      <div className="text-sm text-gray-500">{item.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.reporterName}</div>
                      <div className="text-sm text-gray-500">{item.reporterContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.status === 'Pending' && item.claims && item.claims.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Claim by: {item.claims[0].claimerName}</div>
                          <button
                            onClick={() => handleApproveClaim(item.id, item.claims[0].id)}
                            disabled={isProcessing}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'Found')}
                            disabled={isProcessing}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {item.status === 'Lost' && (
                        <button
                          onClick={() => handleStatusUpdate(item.id, 'Found')}
                          disabled={isProcessing}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Mark as Found
                        </button>
                      )}
                      
                      {item.status === 'Found' && (
                        <div className="text-xs text-gray-500">
                          Awaiting claim
                        </div>
                      )}
                      
                      {item.status === 'Returned' && (
                        <div className="text-xs text-green-600 font-medium">
                          Returned on {item.returnDate ? formatDate(item.returnDate) : 'N/A'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;