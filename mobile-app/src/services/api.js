import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Cars API
export const carsAPI = {
  getAll: () => api.get('/cars'),
  create: (carData) => api.post('/cars', carData),
  getById: (id) => api.get(`/cars/${id}`),
  update: (id, carData) => api.put(`/cars/${id}`, carData),
  delete: (id) => api.delete(`/cars/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  create: (customerData) => api.post('/customers', customerData),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Invoices API
export const invoicesAPI = {
  getAll: () => api.get('/invoices'),
  create: (invoiceData) => api.post('/invoices', invoiceData),
  getById: (id) => api.get(`/invoices/${id}`),
  update: (id, invoiceData) => api.put(`/invoices/${id}`, invoiceData),
  delete: (id) => api.delete(`/invoices/${id}`),
};

// Payments API
export const paymentsAPI = {
  receive: (paymentData) => api.post('/payments/receive', paymentData),
  paymentOut: (paymentData) => api.post('/payments/payment-out', paymentData),
  getAll: () => api.get('/payments'),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

export default api;