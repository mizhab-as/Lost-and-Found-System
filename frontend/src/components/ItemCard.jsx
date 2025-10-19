import React from 'react';
import { formatDate } from '../utils/dateUtils';

function ItemCard({ item, onClaim }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Lost': return 'status-badge status-lost';
      case 'Found': return 'status-badge status-found';
      case 'Pending': return 'status-badge status-pending';
      case 'Returned': return 'status-badge status-returned';
      default: return 'status-badge';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 truncate">{item.name}</h3>
          <span className={getStatusClass(item.status)}>
            {item.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-700 font-medium">{item.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-700 font-medium">{item.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-700 font-medium">{formatDate(item.date)}</span>
          </div>
        </div>
        
        {item.status === 'Found' && (
          <button
            onClick={() => onClaim(item)}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Claim This Item
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemCard;