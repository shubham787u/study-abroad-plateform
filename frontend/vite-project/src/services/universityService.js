import api from './api';

export const universityService = {
  getUniversities: async (params = {}) => {
    // GET /api/universities
    return await api.get('/universities', { params });
  },
};

export default universityService;
