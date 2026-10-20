import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('attaa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// Auth API services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Items API services
export const itemService = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (formData) =>
    api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id, status) => api.put(`/items/${id}/status`, { status }),
  delete: (id) => api.delete(`/items/${id}`),
  getMyItems: () => api.get('/items/user/my-items'),
};

// Reports API services
export const reportService = {
  submitReport: (reportData) => api.post('/reports', reportData),
};

export default api;
