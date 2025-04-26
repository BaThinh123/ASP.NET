import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7058/api', // Base URL of your API
  headers: {
    'Content-Type': 'application/json', // Default Content-Type
  },
});

// Add an interceptor to automatically attach the token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to the header
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);

// Add an interceptor to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout user or refresh token
      localStorage.removeItem('token');
      window.location.href = '/free/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
