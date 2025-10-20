import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  // do not set Content-Type when sending FormData from caller
  headers: { 'Content-Type': 'application/json' }
});

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

export const fetchItems = async (params = {}) => {
  try {
    const res = await api.get('/items', { params });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch items');
  }
};

export const createItem = async (itemData) => {
  try {
    const res = await api.post('/items', {
      ...itemData,
      // Make sure these fields match what the server expects
      name: itemData.description, // Server uses 'name' field
      itemName: itemData.description,
      status: itemData.status || 'reported'
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create item');
  }
};

export const updateItemStatus = async (itemId, status) => {
  try {
    const res = await api.patch(`/items/${itemId}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update item status');
  }
};

export const submitClaim = async (itemId, claimData) => {
  try {
    const res = await api.post(`/items/${itemId}/claims`, claimData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit claim');
  }
};

export const approveItemClaim = async (itemId, claimId) => {
  try {
    const res = await api.post(`/items/${itemId}/claims/${claimId}/approve`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to approve claim');
  }
};