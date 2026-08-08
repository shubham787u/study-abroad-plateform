import api from './api';

export const authService = {
  register: async (userData) => {
    // POST /api/auth/register
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    // POST /api/auth/login
    return await api.post('/auth/login', credentials);
  },

  getProfile: async () => {
    // GET /api/auth/profile
    return await api.get('/auth/profile');
  },

  updateProfile: async (profileData) => {
    // PUT /api/auth/profile
    return await api.put('/auth/profile', profileData);
  },
};

export default authService;
