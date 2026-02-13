import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds for analysis requests
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred. Please try again.';
    const details = error.response?.data?.details;
    
    const enhancedError = new Error(message);
    enhancedError.details = details;
    enhancedError.status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export const analyzeProfile = async (githubUrl) => {
  const response = await api.post('/analyze', { githubUrl });
  return response.data;
};

export const getAnalysis = async (username) => {
  const response = await api.get(`/analysis/${username}`);
  return response.data;
};

export const getApiStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

export const getExampleProfiles = async () => {
  const response = await api.get('/examples');
  return response.data;
};

export default api;