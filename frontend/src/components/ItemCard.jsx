import React from 'react';

const ItemCard = ({ title, items = [] }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-xl font-semibold mb-3">{title} <span className="text-sm text-gray-500">({items.length})</span></h3>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No items</div>
      ) : (
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.id} className="border rounded p-3">
              <div className="font-medium">{item.description || 'No description'}</div>
              <div className="text-sm text-gray-600">Place: {item.location || '—'}</div>
              <div className="text-sm text-gray-600">Date: {item.date ? new Date(item.date).toLocaleDateString() : '—'}</div>
              <div className="text-sm text-gray-600">Name: {item.reporterName || item.name || '—'}</div>
              <div className="text-sm text-gray-600">Contact: {item.reporterContact || item.contact || '—'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemCard;