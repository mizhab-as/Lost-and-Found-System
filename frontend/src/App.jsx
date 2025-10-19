import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { fetchItems } from './api/itemsApi';

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showItemForm, setShowItemForm] = useState(false);
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadItems();
  }, [activeCategory, activeStatus]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      let queryParams = {};
      if (activeCategory !== 'all') queryParams.category = activeCategory;
      if (activeStatus !== 'all') queryParams.status = activeStatus;
      
      const data = await fetchItems(queryParams);
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemAdded = () => {
    setShowItemForm(false);
    loadItems();
  };

  const filterCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'documents', name: 'Documents' },
    { id: 'other', name: 'Other' }
  ];

  const filterStatuses = [
    { id: 'all', name: 'All Status' },
    { id: 'Lost', name: 'Lost Items' },
    { id: 'Found', name: 'Found Items' },
    { id: 'Pending', name: 'Pending Claims' },
    { id: 'Returned', name: 'Returned Items' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        isAuthenticated={isAuthenticated}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {viewMode === 'admin' && !isAuthenticated ? (
          <AdminLogin />
        ) : viewMode === 'admin' && isAuthenticated ? (
          <AdminDashboard items={items} onItemUpdated={loadItems} />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">
                Lost and Found Items
              </h1>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowItemForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Report an Item
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row mb-6 gap-4">
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {filterCategories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {filterStatuses.map(status => (
                  <button
                    key={status.id}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      activeStatus === status.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveStatus(status.id)}
                  >
                    {status.name}
                  </button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <ItemList items={items} onItemUpdated={loadItems} />
            )}
            
            {showItemForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                  <ItemForm 
                    onClose={() => setShowItemForm(false)} 
                    onItemAdded={handleItemAdded} 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

