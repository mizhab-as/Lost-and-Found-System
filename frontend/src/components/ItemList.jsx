import React, { useState } from 'react';
import ItemCard from './ItemCard';
import ClaimForm from './ClaimForm';

function ItemList({ items, onItemUpdated }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);

  const handleClaim = (item) => {
    setSelectedItem(item);
    setShowClaimForm(true);
  };

  const handleClaimSubmitted = () => {
    setShowClaimForm(false);
    onItemUpdated();
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onClaim={handleClaim} 
          />
        ))}
      </div>
      
      {showClaimForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <ClaimForm
              item={selectedItem}
              onClose={() => setShowClaimForm(false)}
              onClaimSubmitted={handleClaimSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemList;