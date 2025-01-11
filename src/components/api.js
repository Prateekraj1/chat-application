import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Middleware for requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Middleware for responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
