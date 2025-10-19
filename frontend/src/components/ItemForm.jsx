import React, { useState } from 'react';
import { createItem } from '../api/itemsApi';
import { formatDate } from '../utils/dateUtils';

function ItemForm({ onClose, onItemAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    status: '',
    reporterName: '',
    reporterContact: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!formData.status) {
        throw new Error('Please select whether the item is Lost or Found');
      }
      
      await createItem({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
      onItemAdded();
      onClose();
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Report {formData.status === 'Lost' ? 'a Lost' : 'a Found'} Item
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Item Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Lost"
                checked={formData.status === 'Lost'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Lost Item
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Found"
                checked={formData.status === 'Found'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Found Item
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="reporterName"
            value={formData.reporterName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Contact Information
          </label>
          <input
            type="text"
            name="reporterContact"
            value={formData.reporterContact}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Reported Item Details
        </h3>
        
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Item Name:</span>
            <span className="text-gray-700 font-medium">{formData.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Description:</span>
            <span className="text-gray-700 font-medium">{formData.description}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-700 font-medium">{formData.category}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-700 font-medium">{formData.location}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-700 font-medium">{formatDate(formData.date)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Reporter:</span>
            <span className="text-gray-700 font-medium">{formData.reporterName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemForm;