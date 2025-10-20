import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ItemsPage from './components/ItemsPage';
import { fetchItems } from './api/itemsApi';

function App() {
  const [viewMode, setViewMode] = useState('user');
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="container mx-auto px-4 py-8">
        {viewMode === 'admin' ? (
          isAuthenticated ? (
            <AdminDashboard items={items} onItemUpdated={loadItems} />
          ) : (
            <div className="text-center py-8">Please log in as admin</div>
          )
        ) : (
          <ItemsPage items={items} onItemAdded={loadItems} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

