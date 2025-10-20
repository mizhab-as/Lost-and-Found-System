import React, { useState } from 'react';
import { createItem } from '../api/itemsApi';
import { useTheme } from '../context/ThemeContext';

function ItemForm({ onClose, onItemAdded }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    description: '',
    location: '',
    date: '',
    reporterName: '',
    reporterContact: '',
    status: 'Lost',
    category: 'Electronics' // Add default category
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Show some loading state
      setIsSubmitting(true); // Add this state if not present
      
      // Make sure the status is capitalized to match backend expectations
      const updatedFormData = {
        ...formData,
        status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1)
      };

      await createItem(updatedFormData);
      
      // Clear form after successful submission
      setFormData({
        description: '',
        location: '',
        date: '',
        reporterName: '',
        reporterContact: '',
        status: 'Lost',
        category: 'Electronics'
      });

      // Call the success callback if provided
      onItemAdded?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting item:', error);
      // Show error to user
      // Add error state if not present
      setError(error.message || 'Failed to submit item'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // Categories list
  const categories = [
    'Electronics',
    'Clothing',
    'Documents',
    'Accessories',
    'Other'
  ];

  // Define dark mode classes
  const inputClasses = `w-full p-2 border rounded ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300'
  }`;

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDark ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isDark ? 'text-white' : ''}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Report an Item
      </h2>
      
      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          className={inputClasses}
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      {/* Add Category field */}
      <div>
        <label className={labelClasses}>Category</label>
        <select
          className={inputClasses}
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>Location</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Date</label>
        <input
          type="date"
          className={inputClasses}
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Your Name</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.reporterName}
          onChange={e => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Contact Information</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.reporterContact}
          onChange={e => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Type</label>
        <select
          className={inputClasses}
          value={formData.status}
          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
          required
        >
          <option value="Lost">Lost Item</option>
          <option value="Found">Found Item</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded ${
            isDark 
              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ItemForm;

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

// Pass this to ItemForm
<ItemForm onItemAdded={loadItems} />