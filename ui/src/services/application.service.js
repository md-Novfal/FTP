import api from './api';

const applicationService = {
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  getDocuments: (id) => api.get(`/applications/${id}/documents`),
};

export default applicationService;
