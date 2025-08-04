import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // In production (Vercel), use relative path to API routes
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // In development, use the environment variable or localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
