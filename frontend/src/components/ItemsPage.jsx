import React, { useEffect, useState } from 'react';
import { fetchItems } from '../api/itemsApi';
import ItemList from './ItemList';
import ItemForm from './ItemForm';
import { useTheme } from '../context/ThemeContext';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  const lostItems = items.filter(item => item.status === 'lost');
  const foundItems = items.filter(item => item.status === 'found');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h2 className="text-xl font-bold mb-4">Lost Items</h2>
            <ItemList items={lostItems} />
          </div>
          
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h2 className="text-xl font-bold mb-4">Found Items</h2>
            <ItemList items={foundItems} />
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Report an Item</h2>
          <ItemForm onSuccess={loadItems} />
        </div>
      </div>
    </div>
  );
}