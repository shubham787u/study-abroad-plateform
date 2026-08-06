import api from './api';

export const recommendationService = {
  getUserProfileRecommendations: async (params = {}) => {
    // GET /api/recommendations
    return await api.get('/recommendations', { params });
  },

  getCustomRecommendations: async (customParams = {}) => {
    // POST /api/recommendations/custom
    return await api.post('/recommendations/custom', customParams);
  },
};

export default recommendationService;
