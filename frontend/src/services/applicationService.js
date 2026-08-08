import api from './api';

export const applicationService = {
  applyToProgram: async (data) => {
    // POST /api/applications
    return await api.post('/applications', data);
  },

  getMyApplications: async (params = {}) => {
    // GET /api/applications
    return await api.get('/applications', { params });
  },

  getApplicationById: async (id) => {
    // GET /api/applications/:id
    return await api.get(`/applications/${id}`);
  },

  updateApplicationStatus: async (id, statusData) => {
    // PATCH /api/applications/:id/status
    return await api.patch(`/applications/${id}/status`, statusData);
  },
};

export default applicationService;
