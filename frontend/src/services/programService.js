import api from './api';

export const programService = {
  getPrograms: async (params = {}) => {
    // GET /api/programs
    return await api.get('/programs', { params });
  },

  getProgramById: async (id) => {
    // GET /api/programs/:id
    return await api.get(`/programs/${id}`);
  },
};

export default programService;
